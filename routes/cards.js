const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  addLikeCard,
  dislikeCard,
  deleteCardById,
} = require('../controllers/cards');

const { createCardJoi, checkCardIdJoi } = require('../middlewares/celebrate');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardJoi, createCard);
cardsRouter.put('/cards/:cardId/likes', checkCardIdJoi, addLikeCard);
cardsRouter.delete('/cards/:cardId/likes', checkCardIdJoi, dislikeCard);
cardsRouter.delete('/cards/:cardId', checkCardIdJoi, deleteCardById);

module.exports = cardsRouter;
