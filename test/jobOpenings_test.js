const chai = require('chai');
const chaiHttp = require("chai-http");

const JobOpening = require("../models/jobOpening");
const User = require("../models/user");
const app = require('../app');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

let managerToken = "";
let employeeToken = "";
let managerId = "";
let employeeId = "";
let jobOpeningId = "";

describe("Opening API testing", () => {
    before((done) => {
        {
            User.deleteMany({}, (err) => {
                User.deleteMany({}, (err) => {
                    JobOpening.deleteMany({}, (err) => {
                        done();
                    })
                });
            });
        }
    })

    //Register an employee
    before((done) => {
        chai.request(app)
            .post('/users/register')
            .send({
                username: 'Employee',
                email: 'employee@nagarro.com',
                password: 'abcd@1234',
                role: 'employee'
            })
            .end((error, res) => {
                should.exist(res.body);
                done();
            })
    })

    //Login an employee
    before((done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                username: 'Employee',
                password: 'abcd@1234'
            })
            .end((error, res) => {
                employeeToken = res.body.userDetails.token;
                employeeId = res.body.userDetails.id;
                done();
            })
    })

    //Register a manager
    before((done) => {
        chai.request(app)
            .post('/users/register')
            .send({
                username: 'Manager',
                email: 'manager@nagarro.com',
                password: 'abcd@1234',
                role: 'manager'
            })
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                expect(res).to.have.status(200);
                done();
            })
    })

    //Login a manager
    before((done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                username: 'Manager',
                password: 'abcd@1234'
            })
            .end((error, res) => {
                managerToken = res.body.userDetails.token;
                managerId = res.body.userDetails.id;
                done();
            })
    })

    // Test to create new opening
    it('should create new job opening', (done) => {

        chai.request(app)
            .post('/jobs/add')
            .set('Authorization', 'Bearer ' + managerToken)
            .send({
                "projectName": "automotive",
                "clientName": "sample",
                "technologies": ["angular", "node"],
                "role": "developer",
                "jobDescription": "full stack developer",
                "status": "open"
            })
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    });

    // Test to fetch list of all job openings with status open
    it('should fetch list of all open job openings', (done) => {
        chai.request(app)
            .get('/jobs')
            .set('Authorization', 'Bearer ' + managerToken)
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                expect(res).to.have.status(200);
                jobOpeningId = res.body[0].id;
                done();
            })
    })


    // Test to apply for a job opening
    it('should apply for an opening', (done) => {
        chai.request(app)
            .put('/jobs/apply/' + jobOpeningId)
            .set('Authorization', 'Bearer ' + employeeToken)
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    })

    // Test to fetch job opening by its id
    it('should fetch job opening by id', (done) => {
        chai.request(app)
            .get('/jobs/' + jobOpeningId)
            .set('Authorization', 'Bearer ' + managerToken)
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    })

    // Test to update job opening by id, changing status to close
    it('should update job opening by id', (done) => {
        chai.request(app)
            .put('/jobs/update/' + jobOpeningId)
            .set('Authorization', 'Bearer ' + managerToken)
            .send({
                "status": "close"
            })
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    })
})