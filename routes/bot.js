const TOKEN = process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN';
const url = process.env.URL || 'URL';

import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
import TelegramBot from 'node-telegram-bot-api';

export const router = express.Router();

console.log('bot router');

// No need to pass any parameters as we will handle the updates with Express
//const bot = new TelegramBot(TOKEN, { webHook: true });
const bot = new TelegramBot(TOKEN);


// We are receiving updates at the route below!
console.log('try bot' + TOKEN);

router.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);

  //console.log(req.body);

  res.sendStatus(200);
});

// Just to ping!
bot.on('message', msg => {
//  bot.sendMessage(msg.chat.id, 'I am alive!');
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `A Вы написали мне: ${msg.text}`);

});

