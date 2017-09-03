const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const multer    = require('multer');
const global    = require('../global')
const fs        = require('fs');
const {ensureLoggedIn,ensureLoggedOut } = require('connect-ensure-login');
const {authorizeSpot,checkOwnership} = require('../middleware/spot-authorization');


  ///////////////////////
 ////// Middleware /////
///////////////////////

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

  ///////////////////////
 //////// CRUD /////////
///////////////////////

router.get('/new-spot', ensureLoggedIn(), (req, res, next) => {
    let mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.render('edit/new_spot', {global, mapsApiKey});
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
    // console.log(newSpot);
  newSpot.save((err, spot) => {
    if (err) { 
      // console.log(err);
      let message = "There was an error creating the spot, please try again later"
      res.render('edit/new_spot', {global, mapsApiKey, message });
    } else {
      // console.log("+++++++++++++////////++++++++");
      // console.log(spot.creator)
      // console.log(spot._id)
      User.findOneAndUpdate({_id: spot.creator}, {$push:{userSpots : spot._id}}, {new: true}, function(err, doc){
    if(err){console.log("Something wrong happened while updating your data!");} 
    // console.log(doc);
}); 
  res.redirect(`/spot/${newSpot._id}`);
  console.log("*************** success!!! ***********");
   }
});
});


router.get('/edit-spot/:id', ensureLoggedIn(), authorizeSpot, (req, res, next) => {
  Spot
  .findById(req.params.id)
  .populate('creator')
  .exec((err, spot) => {
    if (err) {return next(err);} 
      let mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
      res.render('edit/edit_spot', {spot,global,mapsApiKey});
  });  
});

router.post('/edit-spot', ensureLoggedIn(), (req, res, next) => {
  
  let spotID = req.body.spot_id; 

  let spotLocation = {
    type: "Point",
    coordinates: [req.body.longitude, req.body.latitude]
  };

  const updatedSpot = {
  name        : req.body.name,
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
  };
  
  Spot.findByIdAndUpdate(spotID, updatedSpot, {new: true},(err, user) => {
      if (err){ 
            return next(err);
          } else {
            console.log(user);
            res.redirect(`/spot/${spotID}`);
        }
    });  
});


router.post('/spot-img', ensureLoggedIn(), upload.single('mainImage'), (req, res, next) => {

  let spotId = req.body.spot_id
  let oldImg = `./public/${req.body.old_imgUrl}`;
  let newImg = `/uploads/spots/${req.file.filename}`;

   Spot.findByIdAndUpdate(spotId, {$set:{mainImage:newImg}}, {new: true}, 
   (err, spot) => {
    if (err){ return next(err);}
      // console.log(spot);
      fs.stat(oldImg, (err, stats) => {
        if (err) {
            return console.error(err);
        }
        if (oldImg === './public//images/default_spot.png') {
          return res.redirect(`/edit-spot/${spotId}`);
        }
        fs.unlink(oldImg,(err) => {
        if(err) return console.log(err);
        console.log('file deleted successfully');
        res.redirect(`/edit-spot/${spotId}`);
      });  
    });
  });  
}); 


router.post('/spot/delete', ensureLoggedIn(), (req, res, next) => {
  let spotId = req.body.spotId;
  User.update({ _id: req.user._id }, { "$pull": { "userSpots": spotId} }, { safe: true, multi:true }, (err, elem) => {
    if (err){ return next(err);} 
      Spot.findByIdAndRemove(spotId, (err, spot) => {
      if (err){ return next(err);} 
      res.redirect('/your-spots');
    });
  });
});

  ///////////////////////
 ////// just show //////
///////////////////////

router.get('/spot/:id', checkOwnership, (req, res, next) => {
  Spot
  .findById(req.params.id)
  .populate('creator') 
  .exec((err, spot) => {
      console.log(`*****************************
      ********
      **********************`);
      console.log(spot);
      if (err){ return next(err); }
      let mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
      return res.render('show/spot', { spot, mapsApiKey});
    });
  });

router.get('/your-spots', ensureLoggedIn(), (req, res, next) => {
  User
  .findById(req.user._id)
  .populate('userSpots', 'name _id country continent creator mainImage')
  .exec((err, userSpot) => {
   if (err) {return next(err);} 
   res.render('edit/your_spots',{userSpot: userSpot.userSpots});
  });
});

router.get('/fav-spots', ensureLoggedIn(), (req, res, next) => {
  User
  .findById(req.user._id)
  .populate('favouriteSpots')
  .exec((err, user) => {
    if (err) {return next(err);} 
    res.render('show/fav_spots',{favSpots:user.favouriteSpots });
    });
});


module.exports = router;