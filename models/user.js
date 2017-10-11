const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Address Schema
const addressSchema = module.exports = mongoose.Schema({
  state: String,
  city: String,
  street: String
});

// User Schema
const UserSchema = module.exports = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNo: {
    type: Number
  },
  city: {
    type: String
  },
  address: {
    type: [addressSchema]
  },
  receiver: {
    type: Boolean,
    default: false
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requests'
  }]
});

const User = module.exports = mongoose.model('Users', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
  const query = {
    username: username
  };
  User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  const query = {
    email: email
  };
  User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};