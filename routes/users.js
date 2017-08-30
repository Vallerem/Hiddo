const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const multer    = require('multer');
const global    = require('../global')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

//  Multer 

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

router.get('/user/:username', (req, res, next) => {
  User.findOne({username:req.params.username}, (err, user) => {
    if (user === null) {
      return res.redirect('/')
    }
    if (err){ return res.redirect('/'); }
    user.populate('userSpots', (err, user) => {
      if (err){ return res.redirect('/'); }
      return res.render('show/user', { user });
    });
  });
});


router.get('/profile', ensureLoggedIn(), (req, res, next) => {
  res.render('edit/edit_profile');
});
router.post('/profile', ensureLoggedIn(), (req, res, next) => {
  
});

router.post('/update-avatar', upload.single('imgUrl'), ensureLoggedIn(), (req, res, next) => {
  
});

router.get('user/:id/delete', ensureLoggedIn(), (req, res, next) => {

  res.redirect('/')
});




module.exports = router;