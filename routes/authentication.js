const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const passport  = require('passport');
const multer    = require('multer');
const aws       = require('aws-sdk');
const multerS3  = require('multer-s3');
const global    = require('../global');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

// Function to filter images extension
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
        //Should implement something better with flash-message
    }
    cb(null, true);
};

aws.config.region = 'eu-central-1';
aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// aws.config({
//     secretAccessKey: ,
//     accessKeyId: process.env.AWSSecretKey,
//     region: 'eu-central-1'
// });

let s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'hiddo',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + '.jpg');
        }
    })
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg');
  }
});

let mehupload = multer({ storage:storage, fileFilter: imageFilter });

//// Signup
router.get('/signup', ensureLoggedOut(), (req, res, next) => {
    res.render('authentication/signup', {countries : global.COUNTRIES});
});

router.post('/signup', 
upload.single('imgUrl'), 
ensureLoggedOut(), passport.authenticate('local-signup', { 
    successRedirect : '/',
    failureRedirect : '/signup'}
));

//// Login
router.get('/login',  ensureLoggedOut(), (req, res, next) => {
    res.render('authentication/login', { message : req.flash("error")});
});

router.post('/login', ensureLoggedOut(), 
    passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash: true,
        passReqToCallback: true
    })
);

//// Logout
router.post('/logout', ensureLoggedIn(), (req, res) => {
    req.logout();
    res.redirect('/');    
});













module.exports = router;