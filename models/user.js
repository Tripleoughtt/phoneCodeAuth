'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User;

var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  verified: {type: Boolean, required: true, default: false},
  phoneCode: {type: String, required: true, default: phoneCodeGen}
});

function phoneCodeGen(){
  let code = [];
  for (var i = 0; i < 6; i++){
    code.push(Math.floor(Math.random() * 10));
  }
  console.log(code);
  return code.join('')
}

phoneCodeGen();

userSchema.methods.token = function() {
  var payload = {
    username: this.username,
    _id: this._id
  };
  var secret = process.env.JWT_SECRET;
  var token = jwt.encode(payload, secret);
  return token;
};

userSchema.statics.register = function(user, cb) {
  var username = user.username;
  var password = user.password;
  var email = user.email;
  var phone = user.phone;
  User.findOne({$or: [{username: username}, {email: email}, {phone: phone}]}, function(err, user){
    if(err || user) return cb(err || 'Username already taken.');
    bcrypt.genSalt(13, function(err1, salt) {
      bcrypt.hash(password, salt, function(err2, hash) {
        if(err1 || err2) return cb(err1 || err2);
        var newUser = new User();
        newUser.username = username;
        newUser.password = hash;
        newUser.email = email;
        newUser.phone = phone;
        newUser.save(function(err, savedUser){
          savedUser.password = null;
          cb(err, savedUser);
        });
      });
    });
  });
};

userSchema.statics.authenticate = function(inputUser, cb){
  User.findOne({username: inputUser.username}, function(err, dbUser) {
    if(err || !dbUser) return cb(err || 'Incorrect username or password.');
    bcrypt.compare(inputUser.password, dbUser.password, function(err, isGood){
      if(err || !isGood) return cb(err || 'Incorrect username or password.');
      dbUser.password = null;
      cb(null, dbUser);
    });
  });
};

User = mongoose.model('User', userSchema);
module.exports = User;

