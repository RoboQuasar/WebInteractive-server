const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const dataBaseUrl = process.env.NODE_ENV === 'development'
  ? 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb'
  : 'turbo-prod url';

app.use(bodyParser.urlencoded({
  extended: false,
}));

require('./authentication');

mongoose.connect(dataBaseUrl, function (err) {
  if (err) throw err;

  console.log('Successfully connected');
});

const dataBaseConnection = mongoose.connection;

dataBaseConnection.on('error', console.error.bind(console, 'connection error:'));
dataBaseConnection.once('open', function() {
  console.log('Connected to Mongoose Database.');
});

const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'RoboQuasar-Secret',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
