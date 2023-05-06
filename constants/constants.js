/**
 * * Константы для обработки ошибок от сервера
 */

/**
 * * Успешные ответы
 */

const SUCCESS_SUCCESS = 200;
const SUCCESS_CREATED = 201;

/**
 * ! Ошибки на клиенте
 */
const ERROR_INVALID_DATA = 400;
const ERROR_NOT_FOUND = 404;

/**
 * ! Ошибки на сервере
 */

const ERROR_DEFAULT = 500;

/**
 * ! Стандартный мессенж ошибки
 */

const dafaultErrorMessage = 'Произошла ошибка, мы сожалеем :(';

module.exports = {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  dafaultErrorMessage,
};
