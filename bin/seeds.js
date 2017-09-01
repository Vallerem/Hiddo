require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const User     = require('../models/user');
const Spot     = require('../models/spot');
const global   = require('../global')

// User
// .find()
// .remove()
// .exec((err, user) => {
//   if (err) {
//      return console.log(err);
//   }
// });

      // Spot
      // .find()
      // .remove()
      // .exec((err, user) => {
      //   if (err) {
      //      return console.log(err);
      //   }
      // });

        // let seeds = [
//   {
//   username           : "Estheru",
//   email              : "es@mes.com",
//   password           : "set",
//   userInfo: {
//     description : "buuuh",
//     country     : "Spain",
//     interests   : ["Romantic"],
//   }
// },
//   {
//   username           : "Manu",
//   email              : "manu@manu.com",
//   password           : "secrettt",
//   userInfo: {
//     description : "2 cool for school",
//     country     : "Spain",
//     interests   : ["Romantic"],
//   }
// },{
//   username           : "Lucas",
//   email              : "lu@mlucas.com",
//   password           : "random",
//   userInfo: {
//     description : "kkkkkk",
//     country     : "Portugal",
//     interests   : ["Night"],
//   }
// }

      //   {
      //   creator     : "59922ab671c49d7ddd34ae3b",
      //   name        : "El desfiladero de las termóplias",
      //   mainImage   : "/images/default_spot.jpg",
      //   spotInfo    : {
      //      introduction : "Buenas vistas y mucha sangre",
      //      description  : `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. 
          
      //      Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. 
          
          
      //      Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.`,
      //      howToArrive  : "Un sendero oculto cerca del arrollo os llevara al acantilado.",
      //      tips         : "Llevad las armas bien afiladas.",
      //     },
      //   continent   : "Europe",
      //   country     : "Greece",
      //   category    : "Historic",
      //   location    : { 
      //     type: "Point",
      //     coordinates: [22.545555599999943, 38.7984595]
      //    }
      // }
      // ];
 


// User.create(seeds, (err, newUser) => {
//   if (err) {
//     throw err;
//   }

//   newUser.forEach((user) => {
//     console.log(user.username);
//   });
//   mongoose.connection.close();
// });

      // Spot.create(seeds, (err, newSpot) => {
      //   if (err) {
      //     throw err;
      //   }
      //   newSpot.forEach((spot) => {
      //     console.log(spot);
      //   });
      //   mongoose.connection.close();
      // });



//Playing with populate
// User
// .findOne({ username: 'Manu' })
// .populate('followers', null, {username: "Estheru"})
// .exec((err, user) => {
//     if (err) {return (err);} else{
//     console.log(user.email);
//     mongoose.connection.close();
//     }
//   });



User
.findOneAndUpdate({username: "God"}, {$push:{userSpots:"59a8376d0eb264227f033796"}}, {new: true}, 
(err, doc) =>{
  if (err) {console.log(err);} else {console.log(doc);}
})