const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const passport  = require('passport');
const multer    = require('multer');


// Function to filter images extension
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
        //Should implement something better with flash-message
    }
    cb(null, true);
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg');
  }
});

let upload = multer({ storage:storage, fileFilter: imageFilter });

// Signup
router.get('/signup', (req, res, next) => {
    res.render('authentication/signup', {countries : User.COUNTRIES});
});

router.post('/signup', upload.single('imgUrl'), passport.authenticate('local-signup', { successRedirect : '/',
   failureRedirect : '/signup'}
));

// Login
router.get('/login', (req, res, next) => {
    res.render('authentication/login');
});













module.exports = router;