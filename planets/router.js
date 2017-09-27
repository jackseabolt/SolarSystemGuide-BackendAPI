'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Planet } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

function isAdminMiddleware(req, res, next){
  // if(req.user && req.user.isAdmin){
  //   next(); 
  // }
  // else {
  //   console.log(req.user)
  //   res.status(403).json({message: 'There was a problem'}); 
  // }
  next(); 
}

router.get('/', (req, res) => {
  Planet
    .find()
    .then(planets => res.status(200).json(planets));
});

router.get('/:id', (req, res) => {
  Planet
    .findById(req.params.id)
    .then(planet => {
      res.status(200).json(planet);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'}); 
    });
});

// User Post 
router.post('/comment/:planetId', jsonParser, (req, res) => {
  const newComment = req.body;
  Planet
    .update(
      { _id: req.params.planetId},
      { $push: { comments: newComment}}
    )
    .then(planet => res.sendStatus(204))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something screwed up'});
    });
});

// router.put('/comment/:planetIt/:id')

// Admin Post
router.post('/', jsonParser, jwtAuth, isAdminMiddleware, (req, res) => {
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

router.put('/:id', jsonParser, jwtAuth, isAdminMiddleware, (req, res) => {
  if(!(req.params.id || req.body.id || req.params.id === req.body.id)){
    res.status(500).json({error: 'Something went wrong'});
  }
  Planet 
    .findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(planet => {
      res.sendStatus(204); 
    })
    .catch(err => {
      console.error(err); 
      res.status(500).json({error: 'Something went wrong'}); 
    });
});

router.delete('/:id', jwtAuth, isAdminMiddleware, (req, res) => {
  Planet
    .findByIdAndRemove(req.params.id)
    .then(response => {
      res.sendStatus(204); 
    });
});


module.exports = { router };