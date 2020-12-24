const passport = require('passport');
const bcrypt = require('bcrypt');

const userModel = require('../models/user');

// Хэширование пароля
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const loginHandler = (request, response, next) => {
  passport.authenticate('local',
    function(err, user) {
      if (err) return next(err);

      return user
        ? request.logIn(user, function(err) {
          if (err) return next(err);
          return response.redirect('/main');
        })
        : request.redirect('/auth');
    }
  )(request, response, next);
};

const registerHandler = function(request, response, next) {
  const hashedPassword = bcrypt.hashSync(request.body.password, salt);

  const user = new userModel({
    login: request.body.login,
    password: hashedPassword,
  });

  user.save(function(err) {
    if (err) return next(err);

    return request.logIn(user, function(err) {
      if (err) return next(err);
      return response.redirect('/private');
    });
  });
};

const logoutHandler = (req, res) => {
  req.logout();
  res.redirect('/auth');
};

const userInfoHandler = (request, response) => {
  if (!request.user) response.status(404).json({ text: 'Current user not found' });
  response.send(request.user);
};

module.exports = function (app) {
  app.post('/login', loginHandler);
  app.post('/register', registerHandler);
  app.get('/logout', logoutHandler);

  app.get('/user-info', userInfoHandler);
};
