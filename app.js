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
const flash          = require("connect-flash");
const aws            = require('aws-sdk');
const multerS3       = require('multer-s3');


require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);


// Controllers
const index      = require('./routes/index');
const authRoutes = require('./routes/authentication');
const spotRoutes = require('./routes/spots') 
const users      = require('./routes/users') 
const show       = require('./routes/show') 



// Server
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.locals.siteName = "Hiddo";



///// Middleware /////



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
    if (err) { 
      return cb(err); 
    } else{
      return cb(null, user);
    }
  });
});

//Flash messages
app.use(flash()); 
// Strategy => Signing Up
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }
            if (user) {
                return next(null, false);
            } else {
                console.log(req.body);
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
                // Checks if the user uploaded an avatar
                let avatarUrl;
                if (req.file === undefined) {
                  avatarUrl = '/images/default.png';
                } else {
                  avatarUrl = `https://s3.eu-central-1.amazonaws.com/hiddo/avatars/${req.file.key}`;
                }
                // Checkbox filter madness
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

                // Creates and saves the new user
                const newUser = new User({
                  username: req.body.username,
                  email: req.body.email,
                  password: hashPass,
                  imgUrl: avatarUrl,
                  userInfo: {
                    description :req.body.description ,
                    country     :req.body.countrySelected ,
                    interests   :filteredArrayOfInterests
                  }
                });

                newUser.save((err) => {
                    if (err){ 
                      return next(err);
                    } else {
                      console.log(newUser);
                    return next(null, newUser);}
                });
            }
        });
    });
}));

/// Strategy =>  Login  ///// Should handle errors better (FLASH)
passport.use('local-login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }   
    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());



// probably a better sollution
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // res.locals.session = req.session.session;
  if (req.user) {
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  // For now this is fine. If the social network grows we should only pass 
  // some user data, not the whole object.
  console.log(res.locals);
  next();
});



////////////////////////////////////////////////////////////////


//// Routes

app.use('/', index);
app.use('/', authRoutes);
app.use('/', spotRoutes);
app.use('/', users);
app.use('/', show);

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
