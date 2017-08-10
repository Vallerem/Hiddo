let express = require('express');
let router = express.Router();

//pruebas
let User = require('../models/user');
let mongoose = require('mongoose');
var prettyjson = require('prettyjson');

// User
// .findOne({ username: 'Manu' })
// .populate('followers')
// .exec((err, user) => {
//     if (err) {return (err);} else{

//     let names = [];

//     user.followers.forEach(function(element) {
//       nyu.push(element.username);
//     });  

//     console.log(nyu);
//     mongoose.connection.close();
//     }
//   });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* GET Contact page/form. */
router.get('/contact', function(req, res, next) {
  res.render('contact');
});


module.exports = router;
