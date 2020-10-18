const express = require('express');
const router = express.Router();

const Upload = require('../imageUpload/imageUploadServer');
const multer = require('multer');

const fs = require('fs');
const User = require('../models/user');

const passport = require('passport');
const jobOpeningUtility = require('./jobOpenings').jobOpeningUtility;

//Register a user
router.post('/register', async function (req, res, next) {

    if (await User.findOne({ email: req.body.email })) {
        throw `An employee with email:${req.body.email} already exists`;
    }
    else if (await User.findOne({ username: req.body.username })) {
        throw `An employee with username:${req.body.username} already exists`;
    }

    const user = new User(req.body);
    await user.setHashedPassword();

    if(req.body.file){
        let result = await handleProfilePictureUpload(req, res);
        if (result) {
            user.profilePicture = req.file.filename;
        }
        else {
            console.log("Error in uploading profile pic");
        }    
    }
    
    await user.save();
    // res.render('login');
    res.json(user);
})

//Login user
router.post('/login', passport.authenticate("local", { session: false }),
    async function (req, res, next) {
        // res.redirect('/home');
        let userDetails = await req.user.toAuthJson();
        // localStorage["loggedInUserDetails"] = req.user.toAuthJson();
        // res.json(req.user.toAuthJson());
        // res.redirect({token: req.user.toAuthJson().token});

        let jobOpenings = await jobOpeningUtility.getAllJobOpenings();
        if (jobOpenings) {
            // res.render('index', { openings: jobOpenings, userDetails: userDetails });
            res.json({userDetails: userDetails });
        }
    });

//Function to manage profile picture upload using multer
async function handleProfilePictureUpload(req, res) {
    Upload(req, res, function (err) {
        if (err) {
            return false;
        }
        else if (!req.file) {
            return false;
        }
        else if (err instanceof multer.MulterError) {
            return false;
        }
        else {
            return true;
        }
    })
}

//API to upload profile picture for testing
router.post('/uploadProfilePic', async function (req, res, next) {
    Upload(req, res, function (err) {
        if (err) {
            return res.send({ message: err });
        }
        else if (!req.file) {
            return res.send({ message: 'Please select a file to upload!' });
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else {
            res.send("FILE UPLOAD SUCESS!");
        }

        User.findOne({ id: req.params.id })
            .then((user) => {
                if (!user) {
                    res.sendStatus(404)
                }
                if (user.profilePicture) {
                    const path = './uploads/profilePic/' + user.profilePicture;
                    try {
                        fs.unlinkSync(path)
                    } catch (err) {
                        next(err);
                    }
                }
                user.profilePicture = req.file.filename;
                return user.save();
            })
            .then(() => res.json({ message: "File uploaded sucessfully!" }))
            .catch(err => next(err));
    });
})

module.exports = router;
