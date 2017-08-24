const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const multer    = require('multer');
const global    = require('../global')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

router.get('/your-spots', ensureLoggedIn(), (req, res, next) => {

  console.log('*************' + req.user._id)

User
.findOne({ _id: req.user._id })
.populate('userSpots', 'name')
.exec((err, userSpot) => {
  console.log(userSpot);
   res.render('edit/your_spots',{userSpot: userSpot.userSpots});
    if (err) {return (err);} 
    else {return console.log("++++++++++++****++++++++++++");
    }
  });

// Spot
// .findOne({ _id: '59937de063ab22bdce82c4e9'})
// .populate('creator','username userInfo',)
// .exec((err, user) => {
//   res.render('edit/your_spots',{user: user});
//     if (err) {return (err);} 
//     else {
//       return console.log(user);     
//     }   
//   });
    
});








router.get('/new-spot', ensureLoggedIn(), (req, res, next) => {
    res.render('edit/new_spot', {global : global, user: user});
});
















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


module.exports = router;