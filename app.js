const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose       = require('mongoose');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const session        = require('express-session');
const MongoStore     = require('connect-mongo')(session);
const bcrypt         = require('bcrypt');
const User           = require('./models/user');


mongoose.connect('mongodb://localhost:27017/Hiddo-App');


















// Controllers
const index = require('./routes/index');
const authRoutes = require('./routes/authentication');



// Server
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));




///// Middleware /////

app.use( (req, res, next) => {
  if (typeof(req.user) !== "undefined"){
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});


//Passport
app.use(session({
  secret: 'Hiddo',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
    // console.log(user);
  });
});

// Signing Up
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    // To avoid race conditions
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }
            if (user) {
                return next(null, false);
            } else {
              console.log(req.file);
                console.log(req.body);
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
                const newUser = new User({
                  username: req.body.username,
                  email: req.body.email,
                  password: hashPass,
                  imgUrl: `/uploads/${req.file.filename}`,
                  // userInfo: {
                  //   description : ,
                  //   country     :,
                  //   interests   :
                  // }
                });

                newUser.save((err) => {
                    if (err){ 
                      return next(err);
                    } else {
                    return next(null, newUser);}
                });
            }
        });
    });
}));

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////


//// Routes

app.use('/', index);
app.use('/', authRoutes);

////////////////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
