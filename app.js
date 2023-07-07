import express from 'express';
export const app = express();

const PORT = process.env.PORT || 3000

console.log('PORT = ' + PORT);

import {router as indexRouter} from './routes/index.js'; 




app.use(indexRouter);


app.listen(PORT,  function () {
  console.log('Server started at port ' + PORT);
});