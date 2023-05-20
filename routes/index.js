const router = require('express').Router();
const { errors } = require('celebrate');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const NotFoundError = require('../errors/notFoundError');

const { login, createUser } = require('../controllers/users');
const { createUserJoi, loginJoi } = require('../middlewares/celebrate');
const authorizationMiddleware = require('../middlewares/auth');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use(authorizationMiddleware);

router.use(usersRouter, cardsRouter, (req, res, next) => { next(new NotFoundError('Страницы не существует')); });
router.use(errors({ message: 'Ошибка при валидации' }));

module.exports = router;
