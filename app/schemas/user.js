const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    validate: {
      validator: (text) => text.length >= 2,
      message: 'Имя должно быть длиннее двух символов.'
    },
    required: true
  },
  lastname: {
    type: String,
    validate: {
      validator: (text) => text.length >= 2,
      message: 'Фамилия должна быть длиннее двух символов.'
    },
  },
  avatar: Buffer,
  login: {
    type: String,
    validate: {
      validator: (text) => text.length >= 4,
      message: 'Логин должен быть длиннее 4-х символов.'
    },
    unique: true,
    required: true
  },
  password: {
    type: String,
    validate: {
      validator: (text) => text.length >= 5,
      message: 'Длина пароля должна быть больше 5 символов.'
    },
    required: true
  },
});

module.exports = UserSchema;
