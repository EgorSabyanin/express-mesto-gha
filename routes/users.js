const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getMyUser,
} = require('../controllers/users');

const { getUserByIdJoi, updateAvatarJoi, updateUserProfileJoi } = require('../middlewares/celebrate');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getMyUser);
usersRouter.get('/users/:userId', getUserByIdJoi, getUserById);
usersRouter.patch('/users/me', updateUserProfileJoi, updateUserProfile);
usersRouter.patch('/users/me/avatar', updateAvatarJoi, updateUserAvatar);

module.exports = usersRouter;
