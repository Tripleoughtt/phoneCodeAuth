'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(401).send('Authentication required.');
  }

  var auth = req.headers.authorization.split(' ');

  if(auth[0] !== 'Bearer'){
    return res.status(401).send('Authentication required.');
  }

  var token = auth[1];

  try {
    var payload = jwt.decode(token, process.env.JWT_SECRET);
  }
  catch(err){
    return res.status(401).send('Authentication required.');
  }

  var userId = payload._id;

  User.findById(userId, function(err, user){
    if(err || !user) return res.status(401).send(err || 'Authentication required.');
    next();
  });
};
