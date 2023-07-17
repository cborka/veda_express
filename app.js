import express from 'express';
export const app = express();

export let reqId = 0; 

import 'dotenv/config';
import logger from 'morgan';
import {log1, log2} from './lib/logger.js';

// import fs from 'fs';
// import path from 'path';

app.use((req, res, next) => { console.log('rid = ' + ++reqId); next();});
//++reqId;
app.use(logger('dev'));
app.use(log1);

const PORT = process.env.PORT || 3000
console.log('PORT = ' + PORT);


app.use(express.static('public'));



import {router as indexRouter} from './routes/index.js'; 

// view engine setup
app.set('views', 'views');
app.set('view engine', 'hbs'); 




app.use(indexRouter);

app.use(function(err, req, res, next) {
  console.log('err.stack');
  console.error(err.stack);
  res.status(500).send('Something broke! status(500)');
  log2(res.statusCode + '|ERR');
});


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!' + req.url);
  log2(res.statusCode + '|END');
  //console.log(err);
});


app.listen(PORT, () => {
  console.log('Server started at port ' + PORT);
});

// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server')
//   server.close(() => {
//     console.log('HTTP server closed')
//   })
// })