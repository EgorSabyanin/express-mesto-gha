const Card = require('../models/card');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
  ERROR_INVALID_DATA,
  ERROR_DEFAULT,
  dafaultErrorMessage,
  ERROR_NOT_FOUND,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_SUCCESS).send(cards))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(SUCCESS_SUCCESS).send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Введен некорректный ID' });
      }
      return res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  // Запись карточки в БД
  Card.create({ name, link, owner })
    .then((createdCard) => res.status(SUCCESS_CREATED).send(createdCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Получены некорректные данные при создании карточки' });
      }
      return res.status(ERROR_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => res.send(card))
    .catch((error) => {
      if (error.message === 'notValidLikeForCard') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные для поставки лайка' });
      }

      if (error.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }

      return res.status(ERROR_DEFAULT).send({ message: 'Ошибка запроса' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для удаления лайка' });
      }

      res.status(ERROR_DEFAULT).send({ message: 'Ошибка запроса' });
    });
};
