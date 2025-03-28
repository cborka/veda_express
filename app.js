
// const TOKEN = process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN';
// const url = process.env.URL || 'URL';

//const TelegramBot = require('node-telegram-bot-api');
// import TelegramBot from 'node-telegram-bot-api';

// // No need to pass any parameters as we will handle the updates with Express
// export const bot = new TelegramBot(TOKEN, { webHook: true });

import express, { request } from 'express';
export const app = express();

import cors from 'cors';

import session from 'express-session';
import connectpgsimple from 'connect-pg-simple';
const pgSession = connectpgsimple(session);
//const pgSession = require('connect-pg-simple')(expressSession);

import bodyParser from 'body-parser';

export let reqId = 0; 
export let ServerHost = 'host';

import 'dotenv/config';

import logger from 'morgan';
import {log1, log2} from './lib/logger.js';
//import {bot} from './lib/bot.js';

import hbs from 'hbs';
// import fs from 'fs';
// import path from 'path';

const PORT = process.env.PORT || 3000; 

import {pool} from './db.js'

// Сессия
app.use(session({
  store: new pgSession({
    pool : pool,                    // Connection pool
    //pruneSessionInterval: 2*60*60   // 2 часа
    pruneSessionInterval: 20*60   // 20 минут
  }),
  //secret: 'secret keyboard cat',
  secret: process.env.SECRET || 'secret keyboard elephant',
  resave: false,
  saveUninitialized: true,
  rolling: true,            // при каждом запросе переустанавливается maxAge
  cookie: { 
    maxAge: 3*60*1000 // 3 минуты
    //maxAge: 24*60*60*1000 // cутки 
  }
})); 
//SELECT sid, (sess::json->>'cookie')::json->>'expires', sess FROM public.session ORDER BY 2 ASC 

 
// Запоминаю ServerHost для использования в Fetch
app.use((req, res, next) => {
   //или так req.protocol + '://' + req.hostname + ':' + req.socket.localPort + req.url;
   ServerHost = req.protocol + '://' + req.headers.host; // + req.url;
  next();
});

// console.log('cwd ='+process.cwd() ); // = C:\cborka\veda_express

// Мой журнал
app.use((req, res, next) => {++reqId; next();}, log1); // Увеличиваю id запроса и вывожу запись в лог

// Morgan logger
app.use(logger('dev')); //morgan
//app.use(logger('short')); //morgan
//app.use(logger(':id :method :url :response-time'));

// Статика (неизменяемые файлы)
app.use(express.static('public')); 

// Routers
import {router as indexRouter} from './routes/index.js'; 
import {router as userRouter} from './routes/user.js'; 
import {router as testRouter} from './routes/test.js'; 
import {router as botRouter} from './routes/bot.js'; 

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
app.use(testRouter);
app.use(botRouter);

// We are receiving updates at the route below!
// console.log('try bot' + TOKEN);
// app.post(`/bot${TOKEN}`, (req, res) => {
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });

// Just to ping!
// bot.on('message', msg => {
// //  bot.sendMessage(msg.chat.id, 'I am alive!');
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, `Вы написали мне: ${msg.text}`);

// });

// Обработка ошибок
app.use(function(err, req, res, next) {
  console.log('err.stack');
  console.error(err.stack);
  res.render('error', {message: "AAAAAAAAAAAAA", error: err});
//  res.status(500).send('Что-то сломалось! status(500)');
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


