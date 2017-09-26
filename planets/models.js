'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Moons = mongoose.Schema({

});

const PlanetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  composition: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  moons: 
    [
      {
        name : {type: String, required: true}
      }
    ],
  comments:
    [
      {
        content : {type: String, required: true},
        username : {type: String, required: true},
        created : {type: Date, default: Date.now}
      }
    ]
});

// Planet.Schema.virual('moonData').getfunction() {
//   return `${this.moon.n`
// }

PlanetSchema.methods.apiRepr = function () {
  return { 
    name: this.name,
    description: this.description,
    composition: this.composition,
    thumbnail: this.thumbnail,
    moons: this.moons,
    comments: this.comments 
  };
};

const Planet = mongoose.models.Planet || mongoose.model('Planet', PlanetSchema);

module.exports = { Planet };
