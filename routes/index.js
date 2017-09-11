let express    = require('express');
let router     = express.Router();
var nodemailer = require('nodemailer');

//pruebas
let User = require('../models/user');
let mongoose = require('mongoose');


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

router.post('/contact', function(req, res, next) {
  let mail           = process.env.HIDDO_MAIL;
  let mailPassword   = process.env.HIDDO_MAIL_PASSWORD;
  let transporter    = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: mail, 
          pass: mailPassword
        }
    });

  let newContactMail = {
      from: req.body.contact_email,
      to: mail,
      subject: req.body.contact_subject,
      text: `Person: ${req.body.contact_name} ${req.body.contact_surname}
Mail: ${req.body.contact_email}
User: ${req.body.contact_user}
Phone number: ${req.body.contact_number}
      
      
${req.body.contact_message}`
  };
  
  transporter.sendMail(newContactMail, function (error, response) {
      if (error) {
          res.render('contact', { message: 'There was an error. Try to contact us later.', err: true, page: 'contact' });
      }
      else {
          res.render('contact', {message: 'Message sent! Thank you.', err: false, page: 'contact' });
      }
  });    
});


module.exports = router;
