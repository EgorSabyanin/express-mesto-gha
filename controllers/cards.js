const mongoose = require('mongoose');
const Card = require('../models/card');

const AuthorizationError = require('../errors/authError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

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

module.exports.deleteCardById = (req, res, next) => {
  const currentUserId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== currentUserId) {
        throw new AuthorizationError('Вы не можете удалять чужие карточки');
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((deletedCard) => res.status(SUCCESS_SUCCESS).send(deletedCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }

      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Получен некорректный ID для удаления карточки'));
      }

      return next(error);
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
