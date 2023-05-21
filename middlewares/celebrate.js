const { celebrate, Joi } = require('celebrate');

const patternOfLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const createUserJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternOfLink),
  }),
});

const loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});

const getUserByIdJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
});

const updateAvatarJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(patternOfLink),
  }),
});

const updateUserProfileJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const createCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(patternOfLink),
  }),
});

const checkCardIdJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
});

module.exports = {
  createUserJoi,
  loginJoi,
  getUserByIdJoi,
  updateAvatarJoi,
  updateUserProfileJoi,
  createCardJoi,
  checkCardIdJoi,
};
