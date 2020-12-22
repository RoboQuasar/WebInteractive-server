const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    validate: {
      validator: (text) => text.length >= 2,
      message: 'firstname length must be longer then 2 symbols'
    },
    required: true
  },
  lastname: {
    type: String,
    validate: {
      validator: (text) => text.length >= 2,
      message: 'lastname length must be longer then 2 symbols'
    },
  },
  avatar: Buffer,
  login: {
    type: String,
    validate: {
      validator: (text) => text.length >= 4,
      message: 'login length must be longer then 4 symbols'
    },
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = UserSchema;
