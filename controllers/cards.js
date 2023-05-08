const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
  ERROR_INVALID_DATA,
  ERROR_DEFAULT,
  defaultErrorMessage,
  ERROR_NOT_FOUND,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_SUCCESS).send(cards))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.status(SUCCESS_SUCCESS).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не была найдена ' });
      }
      if (error instanceof mongoose.Error.CastError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Введен некорректный ID' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  // Запись карточки в БД
  Card.create({ name, link, owner })
    .then((createdCard) => res.status(SUCCESS_CREATED).send(createdCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Получены некорректные данные при создании карточки' });
      }
      return res.status(ERROR_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      if (error instanceof mongoose.Error.CastError) {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }

      return res.status(ERROR_DEFAULT).send({ message: 'Ошибка запроса' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (error instanceof mongoose.Error.CastError) {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для удаления лайка' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Ошибка запроса' });
    });
};
