const express = require('express');
const router = express.Router();

const events = require('events');
const emitter = new events.EventEmitter();

const JobOpening = require('../models/jobOpening');
const User = require('../models/user');

//Get all open Openings
router.get('/', async function (req, res, next) {

    let openings = await JobOpening.find({ "status": "open" })
    res.json(openings);

});

//Get Opening details by id
router.get('/:id', async function (req, res, next) {
    res.send(await JobOpening.findOne({ id: req.params.id }));
});

//Add new Opening 
router.post('/add', validateManager, async function (req, res, next) {
    const newJobOpeningObj = {
        ...req.body, "createdBy": {
            "managerId": req.user.id,
            "managerName": req.user.username
        }
    }

    const job = new JobOpening(newJobOpeningObj);
    job.save((err, savedJobOpening) => {
        if (err) {
            console.log("Error while creating a job opening:", err);
        }
        res.json(savedJobOpening);
    })
});

//Update an Opening status to close by id
router.put('/update/:id', validateManager, async function (req, res, next) {

    const jobDetails = await JobOpening.findById(req.params.id);

    if (!jobDetails)
        throw 'Opening not found!';

    if (jobDetails && jobDetails.status === "open" && req.body.status === "close") {
        jobDetails.status = req.body.status;
        await jobDetails.save();

        //Emitting a custom event when an opening has been closed
        emitter.emit('JobClosedEvent', { jobOpeningClosed: jobDetails });
        res.json(jobDetails);
    }
})

//Apply to an Opening
router.put('/apply/:id', validateEmployee, async function (req, res, next) {
    const jobOpening = await JobOpening.findById(req.params.id);
    if (!jobOpening || jobOpening.status === "close")
        res.send('Invalid job opening application request');

    if (jobOpening.usersApplied.indexOf(req.user.id) === -1) {
        jobOpening.usersApplied = [...jobOpening.usersApplied, req.user.id]
        await jobOpening.save();

        //Emitting a custom event when an employee has applied to an opening
        emitter.emit('EmployeeAppliedEvent', { applicant: req.user, jobOpeningApplied: jobOpening });

        res.send("Applied to opening successfully!");
    } else {
        res.send('Already applied to this opening');
    }
})

//Function to validate if request is from an employee
function validateEmployee(req, res, next) {
    req.user.role === 'employee' ? next() : next("Invalid Token")
}

//Function to validate if request is from a manager
function validateManager(req, res, next) {
    req.user.role === 'manager' ? next() : next("Invalid Token")
}

//Event listener when an employee has applied to an opening
emitter.on('EmployeeAppliedEvent', async function (data) {
    const notificationMsg = `Employee ${data.applicant.username} has applied for the job opening ${data.jobOpeningApplied.projectName} for role of ${data.jobOpeningApplied.role} `;

    const user = await User.findById(data.jobOpeningApplied.createdBy.managerId);

    if (user) {
        user.notification.push(notificationMsg);
        await user.save();
    }
});

//Event listener when a manager has closed an opening
emitter.on('JobClosedEvent', async function (data) {

    const notificationMsg = `Job opening in ${data.jobOpeningClosed.projectName} for role of ${data.jobOpeningClosed.role} has been closed.`;

    for (let applicant of data.jobOpeningClosed.usersApplied) {
        const user = await User.findById(applicant);
        if (user) {
            user.notification.push(notificationMsg);
            await user.save();
        }
    }

});

//Function to get all openings with status open
async function getAllJobOpenings(){
    
    let openings = await JobOpening.find({ "status": "open" })
    return openings;
}

module.exports = {
    router,
    jobOpeningUtility: {
        getAllJobOpenings
    }
};
