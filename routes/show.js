const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const global    = require('../global')
const fs        = require('fs');
const {ensureLoggedIn,ensureLoggedOut } = require('connect-ensure-login');
const {authorizeSpot,checkOwnership} = require('../middleware/spot-authorization');


router.get('/search', ensureLoggedIn(), function(req, res, next) {
  let itemSearched = req.query.searched;
  let regex = new RegExp( itemSearched, 'g' );
  Spot.find().or(
  [
    { "name" : { $regex: regex, $options: 'i' }}, 
    { "country" : { $regex: regex, $options: 'i' }}
  ])
  .sort({"name" : 1})
  .exec((err, spots) => {
    console.log(spots);
     if (err) return handleError(err);
     console.log(spots);
     res.render('show/search', {spots, itemSearched})
   });
});

router.get('/categories/:category', ensureLoggedIn(), function(req, res, next) {
  let category = req.params.category;
  console.log(category);
  Spot.find({category: category} , (err, spots) => {
    if (err) return handleError(err);
     console.log(spots);
     res.render('show/categories', {spots, category})
  })     
});


router.get('/explore', function(req, res, next) {
  res.render('explore', {global});
  // Spot.find({country: "Greece"}, (err, users) => {
  //   if (err) {console.log(err);}
  //   res.send(users)
  // });
});

router.get('/explore', function(req, res, next) {
  res.render('explore', {global});
  // Spot.find({country: "Greece"}, (err, users) => {
  //   if (err) {console.log(err);}
  //   res.send(users)
  // });
});




module.exports = router;