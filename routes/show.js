const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const Spot      = require('../models/spot');
const passport  = require('passport');
const global    = require('../global')
const fs        = require('fs');
const {ensureLoggedIn,ensureLoggedOut } = require('connect-ensure-login');
const {authorizeSpot,checkOwnership} = require('../middleware/spot-authorization');


router.get('/show', function(req, res, next) {
  Spot.find({country: "Greece"}, (err, users) => {
    if (err) {console.log(err);}
    res.send(users)
  });
});




module.exports = router;