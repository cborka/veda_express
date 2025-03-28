const TOKEN = process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN';
//const url = process.env.URL || 'URL';

import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
import TelegramBot from 'node-telegram-bot-api';

export const router = express.Router();


let Num = 0;
let timerId;

//console.log('bot router');

// No need to pass any parameters as we will handle the updates with Express
//const bot = new TelegramBot(TOKEN, { webHook: true });
const bot = new TelegramBot(TOKEN);


// We are receiving updates at the route below!
//console.log('try bot' + TOKEN);
router.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);

  //console.log(req.body);

  res.sendStatus(200);
});

// Just to ping!
bot.on('message', msg => {
//  bot.sendMessage(msg.chat.id, 'I am alive!');
  const chatId = msg.chat.id;
  //bot.sendMessage(chatId, `A Вы написали <b>мне</b>: ${msg.text}`, {parse_mode : "HTML"});

 if (msg.text[0] == '/') {
  return;
 }


// if (msg.text == '/on') {
//   console.log('auto_on()');
//   auto_on();
//   bot.sendMessage(chatId, 'Начинаю отсчет');
//   return;
// } else if (msg.text == '/off') {
//   console.log('auto_off()');
//   auto_off();
//   bot.sendMessage(chatId, 'Отсчет закончен');
//   return;
// }

  // Обращение к базе данных за ответом
  otvet(msg.text)
    .then (result => {
//      console.log('otvet = ' + result);
      bot.sendMessage(chatId, result);
    })
    // досюда не доходит, потому что ошибка обрабатывается в функции otvet()
    .catch (err => { bot.sendMessage(chatId,'Error: ' + err.message)} );
});

//
//  Меню
//
bot.onText(/\/keys/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
  "reply_markup": {
      "keyboard": [["Sample text", "<b>Second sample</b>"],   ["Keyboard"], ["I'm robot"]]
      }
  });
  
});



  //
  // Запрос к базе данных
  //
  async function otvet(str) {
    //console.log(str);

    let sql = `
      SELECT fio FROM public.phones 
        WHERE id = $1`;

//    let result = 'Нет такого номера'    

     try {
      let result = await db.query(sql, [str]);
      return result?.rows[0].fio || 'хбз';
     } catch (error) {
      return 'Нет такого номера.';
     }
    
  }

  //
  // Периодическое выполнение запроса
  //
  bot.onText(/\/on/, (msg) => {
    console.log('//auto_on()');
    auto_on(msg.chat.id);
  });

  bot.onText(/\/off/, (msg) => {
    console.log('//auto_off()');
    auto_off(msg.chat.id);
  });
  
  function auto_off(chat_id) {
    clearInterval(timerId);
    bot.sendMessage(chat_id, 'Отсчет закончен');
  }

  function auto_on(chat_id) {
    bot.sendMessage(chat_id, 'Начинаю отсчет');
    timerId = setInterval(send2, 5000, chat_id);
  }

  function send2(chat_id) {
    bot.sendMessage(chat_id, Num++);
  }

  