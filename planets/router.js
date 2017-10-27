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
router.get('/:name', (req, res) => {
  Planet
    .find({name: req.params.name})
    .then(planet => {
      res.status(200).json(planet);
    })
    .catch(() => {
      res.status(500).json({error: 'Something went wrong'}); 
    });
});

// User Post 
router.post('/:planetId/comments', jsonParser, jwtAuth, (req, res) => {

  if (req.body.content.length < 1) {
    return res.status(422).json({message: 'Length Must be at Least 1 Character'});
  }
  else if (typeof req.body.content !== 'string') {
    return res.status(422).json({message: 'Invalid Input Type'});
  }

  const newComment = {
    content: req.body.content,
    username: req.user.username
  };
  Planet
    .update(
      { _id: req.params.planetId},
      { $push: { comments: newComment}}
    )
    .then(() => res.sendStatus(201))
    .catch(() => {
      res.status(500).json({error: 'Something screwed up'});
    });
});

// User Delete
router.delete('/:planetId/comments/:commentId', jwtAuth, (req, res) => {
  Planet
    .findByIdAndUpdate(
      {_id: req.params.planetId},
      { $pull: {comments: {_id : req.params.commentId}}}
    )
    .then(() => {
      res.sendStatus(204); 
    })
    .catch(() => {
      res.status(500).json({error: 'Something went wrong'});
    });
});

// User Put
router.put('/:planetId/comments/:commentId', jsonParser, jwtAuth, (req, res) => {
  const updatedComment = req.body.content;
  Planet
    .findOneAndUpdate(
      {_id: req.params.planetId, 'comments._id': req.params.commentId},
      {'comments.$.content': updatedComment}
    )
    .then(() => {
      res.sendStatus(204); 
    })
    .catch(() => {
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
      res.status(201).json(planet);
    })
    .catch(() => {
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
    .then(() => {
      res.sendStatus(204); 
    })
    .catch(() => {
      res.status(500).json({error: 'Something went wrong'}); 
    });
});

// Admin Delete
router.delete('/:id', jwtAuth, isAdminMiddleware, (req, res) => {
  Planet
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.sendStatus(204); 
    });
});


module.exports = { router };