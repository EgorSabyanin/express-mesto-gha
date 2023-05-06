const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  addLikeCard,
  dislikeCard,
  deleteCardById,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.patch('/cards/:cardId/likes', addLikeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);
cardsRouter.delete('/cards/:cardId', deleteCardById);

module.exports = cardsRouter;
