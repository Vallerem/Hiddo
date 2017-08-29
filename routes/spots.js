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
    cb(null, './public/uploads/spots');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg');
  }
});

let upload = multer({ storage:storage, fileFilter: imageFilter });










router.get('/new-spot', ensureLoggedIn(), (req, res, next) => {
    let mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.render('edit/new_spot', {global : global, mapsApiKey: mapsApiKey});
});

router.post('/new-spot', upload.single('mainImage'), ensureLoggedIn(),
 (req, res, next) => {

   let spotImg;
     if (req.file === undefined) {
          spotImg = "/images/default_spot.jpg" ;
        } else {
          spotImg = `/uploads/spots/${req.file.filename}`;
        }

  let spotLocation = {
    type: "Point",
    coordinates: [req.body.longitude, req.body.latitude]
  };

  const newSpot = new Spot({
  creator     : req.body.creator,
  name        : req.body.name,
  mainImage   : spotImg,
  spotInfo    : {
     introduction : req.body.introduction,
     description  : req.body.description,
     howToArrive  : req.body.howToArrive,
     tips         : req.body.tips,
    },
  continent   : req.body.continent,
  country     : req.body.country,
  category    : req.body.category,
  location    : spotLocation
  });
console.log(newSpot);
  newSpot.save((err, spot) => {
    if (err) { 
      console.log(err);
    }else {
      console.log("+++++++++++++////////++++++++");
      console.log(spot.creator)
      console.log(spot._id)
      User.findOneAndUpdate({_id: spot.creator}, {$push:{userSpots : spot._id}}, {new: true}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    } 
    console.log(doc);
}); 
      res.redirect("/your-spots");
      console.log("*************** success!!! ***********");
    }
  });


});

router.get('/edit-spot', ensureLoggedIn(), (req, res, next) => {
    res.render('edit/edit_spot', {global : global});
});


  ///////////////////////
 ////// just show //////
///////////////////////


router.get('/your-spots', ensureLoggedIn(), (req, res, next) => {

User
.findOne({ _id: req.user._id })
.populate('userSpots', 'name _id country continent creator mainImage')
.exec((err, userSpot) => {
  console.log(userSpot);
   res.render('edit/your_spots',{userSpot: userSpot.userSpots});
    if (err) {return (err);} 
    else {return console.log('**** OK ****');
    }
  });


// Getting the creator info 
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

router.get('/fav-spots', ensureLoggedIn(), (req, res, next) => {
    res.render('show/fav_spots');
});



  ///////////////////////
 ////// Middleware /////
///////////////////////






module.exports = router;