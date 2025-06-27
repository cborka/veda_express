const TOKEN = process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN';
//const url = process.env.URL || 'URL';

import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
import * as cbw from '../lib/cbw.js'

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
  otvet(msg.text, msg.from.id)
    .then (result => {
//      console.log('otvet = ' + result);
      bot.sendMessage(chatId, result);
    })
    // досюда не доходит, потому что ошибка обрабатывается в функции otvet()
    .catch (err => { bot.sendMessage(chatId,'Error: ' + err.message)} );
});

//
//  Меню (начинается с /)
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
async function otvet(str, user_id) {
  //console.log(str);

  // let sql = `
  //   SELECT fio FROM public.phones 
  //     WHERE id = $1`;
  let sql = ` SELECT bot.request4($1, $2) AS fio `;

//    let result = 'Нет такого номера'    

  try {
    let result = await db.query(sql, [str, user_id]);
    return result?.rows[0].fio || 'хбз';
  } catch (error) {
    return 'Ошибка...';
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

  db.query('SELECT message FROM bot.messages WHERE message_id = $1', [req.body.message_id])
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
    
      let result = await db.query("SELECT nextval('bot.messages_message_id_seq')");
      let nextid = result.rows[0]?.nextval; 
  
      //result = 
      await db.query('INSERT INTO bot.messages(message_id, message) VALUES ($1, $2)', [nextid, req.body.message]);
  
      res.send(nextid);

    } else {    // Корректируем сообщение

      // Сначала проверим, вдруг нет сообщения с таким message_id
      let result = await db.query("SELECT count(*) FROM bot.messages WHERE  message_id = $1", [req.body.message_id]);
      let cnt = result.rows[0]?.count; 

      if (cnt == 1)
        result = await db.query('UPDATE bot.messages SET message = $2 WHERE message_id = $1', [req.body.message_id, req.body.message]);
      else
        result = await db.query('INSERT INTO bot.messages(message_id, message) VALUES ($1, $2)', [req.body.message_id, req.body.message]);

      res.send(req.body.message_id);

    }
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});
  
//====================================
// Показать список слов
//====================================
router.post('/bot/split_message', async function(req, res) {
  try {
    let sql = 
      `SELECT word, count(word) AS cnt FROM ( 
        SELECT rl.wordroot AS word 
        FROM (((regexp_split_to_table(lower(replace($1, \'\'\'\' , \'"\')), '[.,;?!*:"»«/—()\\s]+' ) AS w
          LEFT JOIN bot.word_list wl ON w = wl.word)
          LEFT JOIN bot.wordroot_words wr ON wl.word_id = wr.word_rf)
          LEFT JOIN bot.wordroot_list rl ON wr.wordroot_rf = rl.wordroot_id)
        ORDER BY word
      )
      GROUP BY word
      ORDER BY 2 desc, 1
    `;

  //   SELECT w, id, r, wordroot_rf FROM ( 
  //     SELECT w, wl.word_id AS id, rl.wordroot AS r, wordroot_rf
  // FROM (((regexp_split_to_table(lower(replace('которого что', '''' , '"')), '[.,;?!*:"»«/—()\s]+' ) AS w
  //   LEFT JOIN bot_word_list wl ON w = wl.word)
  //   LEFT JOIN bot_wordroot_words wr ON wl.word_id = wr.word_rf)
  //   LEFT JOIN bot_wordroot_list rl ON wr.wordroot_rf = rl.wordroot_id)
  //     ORDER BY word
  //   )



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


//====================================
//  ЗАПРОС
//====================================
router.post('/bot/request', async function(req, res) {
  try {
    let sql2 = 
      `SELECT word, count(word) AS cnt FROM ( 
        SELECT word FROM regexp_split_to_table(lower(replace($1, \'\'\'\' , \'"\')), '[.,;?!*:"()\\s]+' ) AS word
        ORDER BY word
      )
      GROUP BY word
      ORDER BY 2 desc, 1
    `;

    let sql = 
      `SELECT request1 
         FROM (
          SELECT bot.request2($1) AS request1 
          UNION ALL 
          SELECT bot.request4($1) AS request1
        )
    `;
    // console.log(req.body);
    // res.send(req.body.request);
    // return;

    let x1 = await db.query(sql, [req.body.request]);
    //let x1 = await db.query("SELECT regexp_split_to_array($1, '[.,;?!*:\s]+') AS word FROM bot.messages WHERE message_id = 1", [req.body.message]);
    //console.log(JSON.stringify(x1.rows[0].word));
    //console.log(JSON.stringify(x1.rows[0].word));
    //console.log(x1);
    res.send(x1.rows[0].request1 + "\n\n" + x1.rows[1].request1);
    // let str = '';
    // for(let i = 0; i<x1.rows.length; i++) {
    //   str += x1.rows[i].word + '|' + x1.rows[i].cnt + '\n';
    // }
    // res.send(str);
//    res.send(JSON.stringify(x1.rows));
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});




//
//     Просто тест и заодно заготовка
//
router.get('/bot/test', async function(req, res) {
  try {
    let x1 = await db.query('SELECT name FROM test2 WHERE id = 1');
    res.send("x1 = " + x1.rows[0].name);
    // let x1 = await db.query('SELECT message FROM bot_messages WHERE message_id = 1');
    // let x2 = await db.query('SELECT message FROM bot_messages WHERE message_id = 2');
    // res.send("x1 + x2 = " + x1.rows[0].message + "|" + x2.rows[0].message);
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

//====================================
// Форма корректировки корневых слов
//====================================
router.get('/bot/word_roots', function(req, res, next) {
    res.render('bot/word_roots', {title: "Корни слов"});
});

/*  */
router.post('/bot/word_roots', function(req, res, next) {
  let message = '{"id":"0","login":"Admin1","email":"adm@ma11il.ad","password":"1","password2":"1","test":"144","fio":"1"};';

  console.log(req.body);

  //-- SELECT word_id, wl.word, wr.wordroot_rf, rl.wordroot, wr.flag 
  db.query(`
    SELECT word_id, wl.word, rl.wordroot, wr.flag AS flag 
    FROM ((bot.word_list wl 
      LEFT JOIN bot.wordroot_words wr ON wl.word_id = wr.word_rf)
      LEFT JOIN bot.wordroot_list rl ON wr.wordroot_rf = rl.wordroot_id)
    WHERE ${req.body.filter}
    ORDER BY rl.wordroot DESC, word_id DESC, word  
    LIMIT 15
    `
    , [])
  .then (result => {
    if (result && (result.rows.length >= 0)) {

      message = cbw.obj2table(result.rows);

      res.render('bot/word_roots', {title: "Корни слов", word: req.body.word, root: req.body.root, flag: req.body.flag, message});
      //res.render('bot/word_roots', {title: req.body.filter, message});
    }
    else {
      //req.session.user = null;
//      delete req.session.user;
      res.send('0');
//      res.send('result is false');
    }
    //res.send(result?.rows[0].fullname)
  })
  .catch (err => { message = err.message;  res.render('index', {title: "Корни слов", message});});

  log2('/bot/word_roots', res.statusCode);
});

//
//  Сохранить корневое слово
//
router.post('/bot/save_wordroot', async function(req, res) {
  try {
    console.log(req.body);

    let wordroot_id = '0';
    let word_id = req.body.word_id;

    let result = await db.query('SELECT wordroot_id FROM bot.wordroot_list WHERE wordroot = $1', [req.body.wordroot]);
    if (result.rows.length == 0) {
      result = await db.query("SELECT nextval('bot.wordroot_list_wordroot_id_seq')");
      wordroot_id = result.rows[0].nextval;
      await db.query('INSERT INTO bot.wordroot_list(wordroot_id, wordroot) VALUES ($1, $2)', [wordroot_id, req.body.wordroot]);
    } else {
      wordroot_id = result.rows[0].wordroot_id;
    }

  
    if (req.body.word_id == '0') {
      result = await db.query("SELECT nextval('bot.word_list_word_id_seq')");
      word_id = result.rows[0].nextval;
      await db.query('INSERT INTO bot.word_list(word_id, word) VALUES ($1, $2)', [word_id, req.body.word]);
    }
    

    result = await db.query('SELECT count(*) AS cnt FROM bot.wordroot_words WHERE word_rf = $1', [req.body.word_id]);
    if (result.rows[0].cnt == 0) {
      await db.query('INSERT INTO bot.wordroot_words(wordroot_rf, word_rf, flag) VALUES ($1, $2, $3)', [wordroot_id, word_id, req.body.flag]);
    } else {
      await db.query('UPDATE bot.wordroot_words SET wordroot_rf = $2, flag = $3 WHERE word_rf = $1 ', [word_id, wordroot_id, req.body.flag]);
    }


     //let result = await db.query("SELECT nextval('bot_messages_message_id_seq')");
     //let nextid = result.rows[0]?.nextval; 
 
     //result = 
     //await db.query('INSERT INTO bot_messages(message_id, message) VALUES ($1, $2)', [nextid, req.body.message]);


     res.send(""+wordroot_id);


     //res.send(req.body.request);
     //res.send('ОК');
    // return;

//    let x1 = await db.query(sql, [req.body.request]);
    //let x1 = await db.query("SELECT regexp_split_to_array($1, '[.,;?!*:\s]+') AS word FROM bot_messages WHERE message_id = 1", [req.body.message]);
    //console.log(JSON.stringify(x1.rows[0].word));
    //console.log(JSON.stringify(x1.rows[0].word));
//    console.log(x1);
//    res.send(x1.rows[0].request1);
    // let str = '';
    // for(let i = 0; i<x1.rows.length; i++) {
    //   str += x1.rows[i].word + '|' + x1.rows[i].cnt + '\n';
    // }
    // res.send(str);
//    res.send(JSON.stringify(x1.rows));
  } catch(err) {
    res.send('Error: ' + err.message);
  }
});

//
//  Удаление строки из таблицы bot_wordroot_words
//
router.post('/bot/delete_wordroot', async function(req, res) {
  try {
    console.log(req.body);

    let result = await db.query('SELECT wordroot_id FROM bot.wordroot_list WHERE wordroot = $1', [req.body.wordroot]);
    let wordroot_id = result?.rows[0]?.wordroot_id
    await db.query('DELETE FROM bot.wordroot_words WHERE word_rf = $1 AND wordroot_rf = $2', [req.body.word_id, wordroot_id]);

    res.send("Строка удалена");

  } catch(err) {
    res.send('Error: ' + err.message);
  }
});


//=======================================
// Форма корректировки шаблонов запросов
//=======================================
router.get('/bot/request_templates', function(req, res, next) {
    res.render('bot/request_templates', {title: "Шаблоны запросов"});
});