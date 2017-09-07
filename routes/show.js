const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const global    = require('../global')
const fs        = require('fs');
const {ensureLoggedIn,ensureLoggedOut } = require('connect-ensure-login');
const {authorizeSpot,checkOwnership} = require('../middleware/spot-authorization');


router.get('/search', function(req, res, next) {
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


// app.User.find().or([{ 'firstName': { $regex: re }}, { 'lastName': { $regex: re }}]).sort('title', 1).exec(function(err, users) {
//     res.json(JSON.stringify(users));
// });








router.get('/show', function(req, res, next) {
  Spot.find({country: "Greece"}, (err, users) => {
    if (err) {console.log(err);}
    res.send(users)
  });
});




module.exports = router;