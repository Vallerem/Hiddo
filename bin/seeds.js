const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Hiddo-App');

const User = require('../models/user');

User
.find()
.remove()
.exec((err, user) => {
  if (err) {
     return console.log(err);
  }
});

let seeds = [
  {
  username           : "Estheru",
  email              : "es@mes.com",
  password           : "set",
  userInfo: {
    description : "buuuh",
    country     : "Spain",
    interests   : ["Romantic"],
  }
},
  {
  username           : "Manu",
  email              : "manu@manu.com",
  password           : "secrettt",
  userInfo: {
    description : "2 cool for school",
    country     : "Spain",
    interests   : ["Romantic"],
  }
},{
  username           : "Lucas",
  email              : "lu@mlucas.com",
  password           : "random",
  userInfo: {
    description : "kkkkkk",
    country     : "Portugal",
    interests   : ["Night"],
  }
}

];
 


User.create(seeds, (err, newUser) => {
  if (err) {
    throw err;
  }

  newUser.forEach((user) => {
    console.log(user.username);
  });
  mongoose.connection.close();
});



//Playing with populate
User
.findOne({ username: 'Manu' })
.populate('followers', null, {username: "Estheru"})
.exec(function (err, user) {
    if (err) {return (err);} else{
    console.log(user.followers[0].email);
    mongoose.connection.close();
    }
  });


