const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const dataBaseUrl = process.env.NODE_ENV === 'development'
  ? 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb'
  : 'turbo-prod url';

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

require('./authentication')();

mongoose.connect(
  dataBaseUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
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
  cookie: {
    sameSite: 'none',
    secure: true,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes').userRoutes(app);

module.exports = app;
