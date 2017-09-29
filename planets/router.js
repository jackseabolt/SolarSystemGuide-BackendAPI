'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Planet } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

function isAdminMiddleware(req, res, next){
  if(req.user && req.user.isAdmin){
    next(); 
  }
  else {
    console.log(req.user)
    res.status(403).json({message: 'There was a problem'}); 
  }
}

// Anyone Get
router.get('/', (req, res) => {
  Planet
    .find()
    .then(planets => res.status(200).json(planets));
});

// Anyone Get
router.get('/:id', (req, res) => {
  Planet
    .findById(req.params.id)
    .then(planet => {
      if(!planet) {
        res.sendStatus(404);
      }
      else res.status(200).json(planet);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'}); 
    });
});

// User Post 
router.post('/:planetId/comment', jsonParser, jwtAuth, (req, res) => {
  const newComment = {
    content: req.body.content,
    username: req.user.username
  };
  Planet
    .update(
      { _id: req.params.planetId},
      { $push: { comments: newComment}}
    )
    .then(planet => res.sendStatus(201))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something screwed up'});
    });
});

// User Delete
router.delete('/:planetId/comment/:commentId', jwtAuth, (req, res) => {
  Planet
    .findByIdAndUpdate(
      {_id: req.params.planetId},
      { $pull: {comments: {_id : req.params.commentId}}}
    )
    .then(response => {
      res.sendStatus(204); 
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

// User Put
router.put('/:planetId/comment/:commentId', jsonParser, jwtAuth, (req, res) => {
  const updatedComment = req.body.content;
  Planet
    .findOneAndUpdate(
      {_id: req.params.planetId, 'comments._id': req.params.commentId},
      {'comments.$.content': updatedComment}
    )
    .then(response => {
      res.sendStatus(204); 
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

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
    .then(planet => {
      res.status(201).json(planet)
    })
    .catch(err => {
      res.status(500).json({error: 'Something went wrong'});
    });
});

// Admin Put
router.put('/:id', jsonParser, jwtAuth, isAdminMiddleware, (req, res) => {
  if(!req.params.id || !req.body.id || req.params.id !== req.body.id){
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

// Admin Delete
router.delete('/:id', jwtAuth, isAdminMiddleware, (req, res) => {
  Planet
    .findByIdAndRemove(req.params.id)
    .then(response => {
      res.sendStatus(204); 
    });
});


module.exports = { router };