const Spot = require('../models/spot');

function authorizeSpot(req, res, next){
  Spot.findById(req.params.id, (err, spot) => {
    if (err)   { return next(err) }
    if (!spot) { return next(new Error('404')) }
    if (spot.belongsTo(req.user)){
       return next()
        } else {
      return res.redirect(`/spot/${spot._id}`)
    }
  });
}

function checkOwnership(req, res, next){
  Spot.findById(req.params.id, (err, spot) => {
    if (err){ return next(err) }
    if (!spot){ return next(new Error('404')) }
    if (res.locals.currentUser === undefined){
      res.locals.campaignIsCurrentUsers = false;
      return next();
    }
    if (spot.belongsTo(req.user)){
      res.locals.campaignIsCurrentUsers = true;
    } else {
      res.locals.campaignIsCurrentUsers = false;
    }
    return next()
  });
}

module.exports = {
  authorizeSpot,
  checkOwnership
}