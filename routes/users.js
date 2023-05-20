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

const { getUserByIdJoi, updateAvatarJoi, updateUserProfileJoi } = require('../middlewares/celebrate');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserByIdJoi, getUserById);
usersRouter.patch('/users/me', updateUserProfileJoi, updateUserProfile);
usersRouter.patch('/users/me/avatar', updateAvatarJoi, updateUserAvatar);
usersRouter.get('/users/me', getMyUser);

usersRouter.post('/signin', login);
usersRouter.post('/signup', createUser);

module.exports = usersRouter;
