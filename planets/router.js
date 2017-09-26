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

router.get('/:id', (req, res) => {
  Planet
    .findById(req.params.id)
    .then(planet => {
      res.status(200).json(planet)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'}); 
    })
})

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
    .then(planet => res.status(201).json(planet))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if(!(req.params.id || req.body.id || req.params.id == req.body.id)){
    res.status(500).json({error: 'Something went wrong'})
  }
  Planet 
    .findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(planet => {
      res.sendStatus(204); 
    })
    .catch(err => {
      console.error(err); 
      res.status(500).json({error: 'Something went wrong'}); 
    })
})

router.delete('/:id', (req, res) => {
  Planet
    .findByIdAndRemove(req.params.id)
    .then(response => {
      res.sendStatus(204); 
    })
})


module.exports = { router };