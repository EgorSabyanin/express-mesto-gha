const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => {
        validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Некорректная ссылка на аватар',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    unique: true,
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Invalid email',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
