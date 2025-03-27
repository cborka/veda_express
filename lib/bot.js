// const TOKEN = process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN';
// const url = process.env.URL || 'URL';

// import TelegramBot from 'node-telegram-bot-api';

// // No need to pass any parameters as we will handle the updates with Express
// export const bot = new TelegramBot(TOKEN, { webHook: true });


// // We are receiving updates at the route below!
// console.log('try bot' + TOKEN);
// app.post(`/bot${TOKEN}`, (req, res) => {
//   bot.processUpdate(req.body);

//   res.sendStatus(200);
// });

// // Just to ping!
// bot.on('message', msg => {
// //  bot.sendMessage(msg.chat.id, 'I am alive!');
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, `A Вы написали мне: ${msg.text}`);

// });