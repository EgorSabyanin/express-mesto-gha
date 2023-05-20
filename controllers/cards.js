const mongoose = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const ForbiddenError = require('../errors/forbiddenError');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
} = require('../constants/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_SUCCESS).send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const currentUserId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== currentUserId) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
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

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  // Запись карточки в БД
  Card.create({ name, link, owner })
    .then((createdCard) => res.status(SUCCESS_CREATED).send(createdCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Получены некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (error instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные для постановки лайка'));
      }

      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (error instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные для удаления лайка'));
      }
      return next(error);
    });
};
