'use strict';

var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

router.get('/', authMiddleware, function(req, res) {
  res.send('aofiejaoiefjioaejfioefj TURTLES oaiejf oaiwejf oaiwejf oaiejf oiaej f');
});

module.exports = router;
