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
          console.log('Successfully logined!');
          return response.sendStatus(200);
        })
        : response.status(422).json({ text: 'Логин не найден.' });
    }
  )(request, response, next);
};

const registerHandler = async function(req, res, next) {
  if (!req.body.password) {
    res.status(400).json({ text: 'Поле "Пароль" обязательно должно быть заполнено!' });
    return new Error('Password is Required');
  }

  if (!req.body.firstname) {
    res.status(400).json({ text: 'Не заполнено поле "Имя"!' });
    return new Error('Password is Required');
  }

  const userData = await userModel.findOne({ login: req.body.login });
  if (userData && userData.login) {
    res.status(422).json({ text: 'Этот Логин или Почта уже используется.' });
    return new Error('Login already used!');
  }

  if (req.body.password !== req.body.passwordConfirm) {
    res.status(422).json({ text: 'Пароль и подтверждение пароля должны совпадать.' });
    return new Error('Passwords are not equal');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    login: req.body.login,
    password: hashedPassword,
  });

  user.save(function(err) {
    if (err) return next(err);

    return req.logIn(user, function(err) {
      if (err) return next(err);
      console.log('Successfully registered!');
      return res.status(200).send('OK');
    });
  });
};

const logoutHandler = (req, res) => {
  req.logout();
  res.redirect('/auth');
};

const userInfoHandler = (request, response) => {
  if (!request.user) {
    console.log('Current user not found');
    response.status(404).json({ text: 'Current user not found' });
  }
  response.send(request.user);
};

module.exports = function (app) {
  app.post('/login', loginHandler);
  app.post('/register', registerHandler);
  app.post('/logout', logoutHandler);

  app.get('/user-info', userInfoHandler);
};
