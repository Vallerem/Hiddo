const express = require('express');
const router  = express.Router();

router.get('/signup', (req, res, next) => {
    res.render('authentication/signup');
});

router.get('/login', (req, res, next) => {
    res.render('authentication/login');
});











module.exports = router;