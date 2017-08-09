var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
}); //play with res.locals

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* GET Contact page/form. */
router.get('/contact', function(req, res, next) {
  res.render('contact');
});


module.exports = router;
