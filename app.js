import express from 'express';
export const app = express();

import cors from 'cors';
import session from 'express-session';

import bodyParser from 'body-parser';

export let reqId = 0; 

import 'dotenv/config';

import logger from 'morgan';
import {log1, log2} from './lib/logger.js';

import hbs from 'hbs';
// import fs from 'fs';
// import path from 'path';

const PORT = process.env.PORT || 3000; 

// Сессия
app.use(session({
  secret: 'secret keyboard cat',
  resave: false,
  saveUninitialized: true,
  rolling: true,            // при каждом запросе переустанавливается maxAge
  cookie: { 
    maxAge: 3*60*1000 
    //maxAge: 24*60*60*1000 // cутки 
  }
}));


// Мой журнал
app.use((req, res, next) => { ++reqId; next();}, log1); // Увеличиваю id запроса и вывожу запись в лог

// Morgan logger
app.use(logger('dev')); //morgan
//app.use(logger('short')); //morgan
//app.use(logger(':id :method :url :response-time'));

// Статика (неизменяемые файлы)
app.use(express.static('public')); 

// Routers
import {router as indexRouter} from './routes/index.js'; 
import {router as userRouter} from './routes/user.js'; 

// view engine setup
app.set('views', 'views');
app.set('view engine', 'hbs'); 
hbs.registerPartials("views/partials"); // каталог с частичными представлениями

// bodyParser
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

// Routers
app.use(indexRouter);
app.use(userRouter);

// Обработка ошибок
app.use(function(err, req, res, next) {
  console.log('err.stack');
  console.error(err.stack);
  res.status(500).send('Something broke! status(500)');
  log2('ERR', res.statusCode);
});

// Страница не найдена
app.use(function(req, res, next) {
  // res.status(404).send('Sorry cant find that!' + req.url);
  res.status(404).render('404', {url: req.url});
  log2('END 404', res.statusCode);
  //console.log(err);
});



app.listen(PORT, () => {
  console.log('Server started at port ' + PORT);
  //log2('Server started at port ' + PORT, 'START');
});

// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server')
//   server.close(() => {
//     console.log('HTTP server closed')
//   })
// })


