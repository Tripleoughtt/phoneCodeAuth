'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost/userauth';

var mongoose = require('mongoose');
mongoose.connect(mongoUrl, function(err){
  if(err) return console.log('Error connecting to Mongodb:', err);
  console.log('Connected to MongoDB:', mongoUrl);
});

var app = express();

app.set('view engine', 'jade');

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/turtles', require('./routes/turtles'));

// 404 HANDLER
app.use(function(req, res){
  res.status(404).render('404')
});

app.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});

module.exports = app;
