const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Авторизируйтесь!'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'big-secret');
  } catch (error) {
    return next(new AuthorizationError('Авторизируйтесь!'));
  }

  req.user = payload;
  return next();
};
