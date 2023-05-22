const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const NotFoundError = require('../errors/notFoundError');

const { login, createUser } = require('../controllers/users');
const { createUserJoi, loginJoi } = require('../middlewares/celebrate');
const authorizationMiddleware = require('../middlewares/auth');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use(authorizationMiddleware); /* Защита роутинга для неавторизованных пользователей */
router.use(usersRouter, cardsRouter, (req, res, next) => { next(new NotFoundError('Страницы не существует')); });

module.exports = router;
