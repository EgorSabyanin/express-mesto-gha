const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getMyUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', updateUserAvatar);
usersRouter.get('/users/me', getMyUser);

usersRouter.post('/signin', login);
usersRouter.post('/signup', createUser);

module.exports = usersRouter;
