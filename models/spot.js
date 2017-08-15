const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User     = require('./user');
const global   = require('../global')

const spotSchema = new Schema({
  creator     : { type: Schema.ObjectId, ref: 'User', required: true  },
  name        : { type: String, required: true },
  mainImage   : { type: String, default: "/images/default_spot.jpg"  },
  spotInfo    : {
     introduction : { type: String,},
     description  : { type: String, required: true },
     howToArrive  : { type: String },
     tips         : { type: String },
     gallery      : [{ type: String}]
    },
  continent   : { type: String, enum: global.CONTINENTS, required: true  },
  country     : { type: String, enum: global.COUNTRIES, required: true  },
  category    : { type: String, enum: global.INTERESTS, required: true  },
  likedBy     : [{ type: Schema.ObjectId, ref: 'User' }],
  location    : { type: { type: String }, coordinates: [Number] }
}, {timestamps: true });

spotSchema.index({ location: '2dsphere' });



const Spot = mongoose.model('Spot', spotSchema);
module.exports = Spot;



