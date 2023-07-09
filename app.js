import express from 'express';
export const app = express();

import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000
console.log('PORT = ' + PORT);



app.use(express.static('public'));

import {router as indexRouter} from './routes/index.js'; 

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
app.set('view engine', 'hbs'); 




app.use(indexRouter);

// app.use(function(err, req, res, next) {
//   console.log('err.stack');
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });



app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!' + req.url);
  //console.log(err);
});


app.listen(PORT, () => {
  console.log('Server started at port ' + PORT);
});