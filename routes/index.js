const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const {
  ERROR_NOT_FOUND,
} = require('../constants/constants');

router.use(usersRouter, cardsRouter, (req, res) => { res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' }); });

module.exports = router;
