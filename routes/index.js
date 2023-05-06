const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

const {
  ERROR_NOT_FOUND,
} = require('../constants/constants');

router.use(userRouter, cardRouter, (req, res) => { res.status(ERROR_NOT_FOUND).send({ message: '404 Not Found' }); });

module.exports = router;
