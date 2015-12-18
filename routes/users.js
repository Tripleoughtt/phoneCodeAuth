'use strict';

var express = require('express');
var router = express.Router();
var mailgun = require('mailgun-js')({apiKey: 'key-acd11a66f6a29644069caf837c6a09a1', domain: 'rgautereaux.com'});

var User = require('../models/user');
var accountSid = 'ACa2f5221a6abe6fd9768ae35c5d778539'; 
var authToken = '8965cd31d3213faa2a91bbfb591b3ced'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
// USERS

// register a new user
router.post('/register', function(req, res) {
  User.register(req.body, function(err, savedUser){
    if(err){res.status(400).send(err)};
      var data = {
        from: 'Badass Authentication <postmaster@yeahwerebadass.net>',
        to: savedUser.email,
        subject: `Welcome To Badass Authentication ${savedUser.username}!`,
        text: `Welcome to Badass Authentiation ${savedUser.username}, We're glad to have you!!!!`
      }

      mailgun.messages().send(data, function (error, body) {
        if(error) console.log(error);
        console.log(body);
      })

  });
});

router.post('/recover', function(req, res){
  User.findOne({username: req.body.username}, function(err, foundUser){
    if (err) res.status(400).send(err);
    console.log(foundUser);
		client.messages.create({ 
		    to: foundUser.phone, 
		    from: "+15717622481", 
		    body: `Hello! Here's your account recovery code: ${foundUser.phoneCode}, enter it on the site to reset your password!`  
		}, function(err, message) { 
		    console.log(err || message.sid); 
		});

  })
});

router.post('/reset', (req, res) => {
  User.findOneAndUpdate({phoneCode: req.body.phoneCode, username: req.body.username}, {$set: {password: req.body.newPass}}, function(err, updatedUser){
    if (err) res.status(400).send(err);
    res.status(200).send(updatedUser)
  })
});

router.post('/login', function(req, res) {
  User.authenticate(req.body, function(err, user){
    if(err || !user) {
      res.status(400).send(err);
    } else {
      var token = user.token();
      console.log('token:', token);
      res.cookie('token', token);
      res.send(user);
    }
  });
});

router.post('/logout', function(req, res) {
  res.clearCookie('username');
  res.clearCookie('userId');
  res.clearCookie('token');
  res.send();
})

module.exports = router;
