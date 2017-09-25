'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { Planet } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  Planet
    .find()
    .then(planets => res.json(planets));
});

router.post('/', jsonParser, (req, res) => {
  const newPlanet = { 
    name: req.body.name,
    description: req.body.description,
    composition: req.body.composition,
    thumbnail: req.body.thumbnail,
    moons: req.body.moons,
    comments: req.body.comments
  };

  Planet
    .create(newPlanet)
    .then(planet => res.status(201).json(planet.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

module.exports = { router };