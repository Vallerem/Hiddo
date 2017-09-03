const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const multer    = require('multer');
const global    = require('../global')
const fs        = require('fs');
const bcrypt    = require('bcrypt');
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
  res.render('edit/edit_profile', {countries : global.COUNTRIES,
                                   interests : req.user.userInfo.interests });
});

router.post('/profile', ensureLoggedIn(), (req, res, next) => {

  let old_pass = req.body.old_password;
  let new_pass = req.body.password;

  if (old_pass != 0 && (!bcrypt.compareSync(old_pass, req.user.password))) {
      let message= "Current password not valid"
      return  res.render('edit/edit_profile', {countries : global.COUNTRIES,
                                      interests : req.user.userInfo.interests,
                                      message});
    } 
    let password

    if (new_pass != 0 || null || undefined) {
      password = bcrypt.hashSync(new_pass, bcrypt.genSaltSync(10), null);;
    } else {
      password = req.user.password
    }

      let interestsArray = [req.body.nature, 
                        req.body.night,
                        req.body.romantic,
                        req.body.beach,
                        req.body.gastronomy,
                        req.body.historic,
                        req.body.abandoned,
                        req.body.peacefull,
                        req.body.mysterious,
                        req.body.folklore,
                        req.body.landscape,
                        req.body.urban,
          ]; 
      let filteredArrayOfInterests = interestsArray.filter((e) => {
        return e !== undefined;
      });
      //  console.log(filteredArrayOfInterests);
      const updatedUser = {
        email: req.body.email,
        password: password,
        userInfo: {
          description :req.body.description,
          country     :req.body.countrySelected,
          interests   :filteredArrayOfInterests
        }
      }

    User.findByIdAndUpdate(req.user._id, updatedUser, {new: true}, 
    (err, user) => {
      if (err){ 
            return next(err);
          } else {
            console.log(user);
            res.redirect('/profile');
        }
    });  
});

router.post('/avatar-img',ensureLoggedIn(), upload.single('imgUrl'), (req, res, next) => {
  
  let oldImg = `./public/${req.body.old_imgUrl}`;
  let newImg = `/uploads/${req.file.filename}`;

   User.findByIdAndUpdate(req.user._id, {$set:{imgUrl:newImg}}, {new: true}, 
   (err, user) => {
    if (err){ return next(err);}
      console.log(user);
      fs.stat(oldImg, (err, stats) => {
        if (err) {
            return console.error(err);
        }
        if (oldImg === './public//images/default.png') {
          return res.redirect('/profile');
        }
        fs.unlink(oldImg,(err) => {
        if(err) return console.log(err);
        console.log('file deleted successfully');
        res.redirect('/profile');
      });  
    });
  });  
});

router.post('/user/delete', ensureLoggedIn(), (req, res, next) => {
   let userId = req.body.userId || req.user._id;
   User.findByIdAndRemove(userId, (err, user) => {
    if (err){ return next(err);}
    res.redirect('/');
  });
});




module.exports = router;