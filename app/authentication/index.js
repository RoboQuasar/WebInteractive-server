const userModel = require('../models/user');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// Generate Password
const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

passport.serializeUser(function(user, doneCallback) {
  doneCallback(null, user.login);
});

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
});

function initPassportStrategy () {
  passport.use(new LocalStrategy(
    (login, password, done) => {
      userModel.findOne({ login: login }, function (err, user) {
        if (err) return done(err);


      });


      findUser(login, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
  ))

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
