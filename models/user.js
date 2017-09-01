const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Spot     = require('./spot');
const global   = require('../global')

const userSchema = new Schema({
  username           : { type: String, required: true, unique: true, trim: true,                          minlength: 3, maxlength: 15},
  email              : { type: String, required: true, unique: true },
  password           : { type: String, required: true },
  userInfo: {
    description : String,
    country     : { type: String, enum: global.COUNTRIES },
    interests   : [{ type: String, enum: global.INTERESTS, required: true }],
  },
  imgUrl             : { type: String, default: "/images/default.png" },
  userSpots          : [{ type: Schema.ObjectId, ref: 'Spot' }],
  favouriteSpots     : [{ type: Schema.ObjectId, ref: 'Spot' }],
  followers          : [{ type: Schema.ObjectId, ref: 'User' }],
  following          : [{ type: Schema.ObjectId, ref: 'User' }],
  facebookID         : String,
  role               : { type: String, enum :global.ROLES , default : 'EDITOR'},
}, {timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;



