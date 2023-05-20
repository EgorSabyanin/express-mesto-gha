// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const AuthorizationError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
} = require('../constants/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_SUCCESS).send(users))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_SUCCESS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (error instanceof mongoose.Error.CastError) {
        return next(new RequestError('Введен некорректный ID'));
      }
      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    password,
    email,
  } = req.body;

  // Запись пользователя в БД
  bcrypt.hash(password, 15)
    .then((hash) => {
      User.create({
        name, about, avatar, password: hash, email,
      })
        .then((createdUser) => res.status(SUCCESS_CREATED).send(createdUser))
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return next(new RequestError('Некорректные данные при создании пользователя'));
          }
          if (error.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }
          return next(error);
        });
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body || {};

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      res.status(SUCCESS_SUCCESS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не существует'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Некорректные данные для обновления пользователя'));
      }
      return next(error);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body || {};

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(SUCCESS_SUCCESS).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(NotFoundError('Пользователь не найден'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Некорректные данные для обновления аватара'));
      }
      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+passoword')
    .then((user) => {
      if (!user) {
        return next(new AuthorizationError('Такого пользователя не существует. Проверьте логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthorizationError('Неправильный логин или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },
            'big-secret',
            {
              expiresIn: '7d',
              httpOnly: true,
            },
          );

          return res.send({ token });
        });
    })
    .catch((error) => { res.send({ error }); });
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(SUCCESS_SUCCESS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(error);
    });
};
