const User = require('../models/user');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  dafaultErrorMessage,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_SUCCESS).send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    res.status(SUCCESS_SUCCESS).send(user);
  }).catch((error) => {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    if (error.name === 'CastError') {
      return res.status(ERROR_INVALID_DATA).send({ message: 'Введен некорректный ID' });
    }
    return res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage });
  });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // Запись пользователя в БД
  User.create({ name, about, avatar })
    .then((createdUser) => res.status(SUCCESS_CREATED).send(createdUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Получены некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body || {};

  if (!name || !about) {
    return res.status(ERROR_INVALID_DATA).send({ message: 'Переданны некорректные данные при обновлении профиля пользователя' });
  }

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SUCCESS_SUCCESS).send(user);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Невалидные данные для обновления профиля пользователя' });
      }

      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователя с таким ID не сущесвует' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body || {};

  if (!avatar) {
    return res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(SUCCESS_SUCCESS).send(user))
    .catch((error) => {
      if (error.message === 'CastError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Невалидные данные для обновления аватара' });
      }
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Нет пользователя с таким ID.' });
      }
      return res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage });
    });
};
