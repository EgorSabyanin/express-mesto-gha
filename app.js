const express = require('express');
const mongoose = require('mongoose');

const handleUnexpectedErrorsMiddleware = require('./middlewares/handleUnexpectedErrors');

const router = require('./routes/index');

const { PORT = 3000, DB_CONNECTION = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(router);

// Подключение к БД
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('База данных подключена');
}).catch((error) => {
  console.error('Ошибка при подключении к БД:', error);
});

app.use(handleUnexpectedErrorsMiddleware);

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Сервер столкнулся с ошибкой ${error}`);
  } else {
    console.info(`Сервер был запущен на порту: ${PORT}`);
  }
});
