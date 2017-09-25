'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { Planet } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();



module.exports = { router };