const userModel = require('../models/user');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, doneCallback) {
  doneCallback(null, user.login);
});

passport.deserializeUser(function (login, doneCallback) {
  userModel.findOne({ login: login }, function(err, user) {
    err
      ? doneCallback(err)
      : doneCallback(null, user);
  });

});

function initPassportStrategy () {
  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password'
    },
    (login, password, doneCallback) => {
      userModel.findOne({ login: login }, function (err, user) {
        if (err) return doneCallback(err);

        if (!user) {
          console.log('Login not found.');
          return doneCallback(null, false,  { message: 'Login not found.' });
        }

        // Always use hashed passwords and fixed time comparison
        // in user.password saved hash of real password
        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) return doneCallback(err);

          if (!isValid) return doneCallback(null, false,  { message: 'Password is incorrect.' });

          return doneCallback(null, user);
        });
      });
    }
  ));

  passport.authenticationMiddleware = function () {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');
    }
  };
}

module.exports = initPassportStrategy;
