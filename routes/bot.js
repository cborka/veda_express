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
  bot.sendMessage(chat_id, 'Начинаю отсчет от 0 до 5');
  timerId = setInterval(send2, 1500, chat_id);
}

function send2(chat_id) {
  bot.sendMessage(chat_id, Num++);
  if (Num > 5) {
    Num = 0;
    auto_off(chat_id);
  }
}



//=======================================================================================

//
// Показать форму сообщений бота
//
router.get("/bot/messages", (req, res) => {
  res.render('bot/messages', {id: 3})
  //res.sendStatus(200);
});


//
// Вернуть сообщение с указанным message_id
//
router.post('/bot/read_message', async function(req, res) {

  console.log(req.body);

  db.query('SELECT message FROM bot_messages WHERE message_id = $1', [req.body.message_id])
  .then (result => {
    if (result?.rows[0]) {
      res.send(result?.rows[0]?.message);
    } else {
      res.send("Нет сообщения с id = " + req.body.message_id);
    }
  })
  .catch (err => res.send('Error: ' + err.message));
});


//====================================
// Записать сообщение в базу данных
//====================================
router.post('/bot/write_message', async function(req, res) {

  try {
    if(req.body.message_id == 0) {    // Вставляем новое сообщение
    
      let result = await db.query("SELECT nextval('bot_messages_message_id_seq')");
      let nextid = result.rows[0]?.nextval; 
  
      //result = 
      await db.query('INSERT INTO bot_messages(message_id, message) VALUES ($1, $2)', [nextid, req.body.message]);
  
      res.send(nextid);

    } else {    // Корректируем сообщение

      let result = await db.query('UPDATE bot_messages SET message = $2 WHERE message_id = $1', [req.body.message_id, req.body.message]);

      res.send(req.body.message_id);

    }
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});
  
// Показать список слов
router.post('/bot/split_message', async function(req, res) {
  try {
    let sql = 
      `SELECT word, count(word) AS cnt FROM ( 
        SELECT word FROM regexp_split_to_table(lower(replace($1, \'\'\'\' , \'"\')), '[.,;?!*:"()\\s]+' ) AS word
        ORDER BY word
      )
      GROUP BY word
      ORDER BY 2 desc, 1
    `;

    let x1 = await db.query(sql, [req.body.message]);
    //let x1 = await db.query("SELECT regexp_split_to_array($1, '[.,;?!*:\s]+') AS word FROM bot_messages WHERE message_id = 1", [req.body.message]);
    //console.log(JSON.stringify(x1.rows[0].word));
    let str = '';
    for(let i = 0; i<x1.rows.length; i++) {
      str += x1.rows[i].word + '|' + x1.rows[i].cnt + '\n';
    }
    res.send(str);
//    res.send(JSON.stringify(x1.rows));
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});


// Просто тест и заодно заготовка
router.post('/bot/request', async function(req, res) {
  try {
    let sql = 
      `SELECT word, count(word) AS cnt FROM ( 
        SELECT word FROM regexp_split_to_table(lower(replace($1, \'\'\'\' , \'"\')), '[.,;?!*:"()\\s]+' ) AS word
        ORDER BY word
      )
      GROUP BY word
      ORDER BY 2 desc, 1
    `;

    // console.log(req.body);
    // res.send(req.body.request);
    // return;

    let x1 = await db.query(sql, [req.body.request]);
    //let x1 = await db.query("SELECT regexp_split_to_array($1, '[.,;?!*:\s]+') AS word FROM bot_messages WHERE message_id = 1", [req.body.message]);
    //console.log(JSON.stringify(x1.rows[0].word));
    let str = '';
    for(let i = 0; i<x1.rows.length; i++) {
      str += x1.rows[i].word + '|' + x1.rows[i].cnt + '\n';
    }
    res.send(str);
//    res.send(JSON.stringify(x1.rows));
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});





// Просто тест и заодно заготовка
router.get('/bot/test', async function(req, res) {
  try {
    let x1 = await db.query('SELECT message FROM bot_messages WHERE message_id = 1');
    let x2 = await db.query('SELECT message FROM bot_messages WHERE message_id = 2');
    res.send("x1 + x2 = " + x1.rows[0].message + x2.rows[0].message);
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});


// _lines := regexp_split_to_array(txt, '\r\n+');
// _lines_num := array_length(_lines, 1);

// FOR i IN 2.._lines_num
//   LOOP
//     _fields := regexp_split_to_array(_lines [ i], '\t');
//     _fields_num := array_length(_fields, 1);