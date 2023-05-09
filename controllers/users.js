const mongoose = require('mongoose');
const User = require('../models/user');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  defaultErrorMessage,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_SUCCESS).send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_SUCCESS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      if (error instanceof mongoose.Error.CastError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Введен некорректный ID' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // Запись пользователя в БД
  User.create({ name, about, avatar })
    .then((createdUser) => res.status(SUCCESS_CREATED).send(createdUser))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Получены некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.updateUserProfile = (req, res) => {
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
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователя с таким ID не сущесвует' });
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Введены не валидные данные для пользователя' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body || {};

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(SUCCESS_SUCCESS).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Нет пользователя с таким ID.' });
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Получены невалидные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};
