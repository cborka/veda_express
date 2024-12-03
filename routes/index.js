import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
export const router = express.Router();


const index = function(req, res) {
  let message = `
  <h3 class="marine">Новый проект.</h3>
  <p class="marine">Чистые HTML, CSS, JS + NodeJS Express</p>
  `;
  res.render('index', {title: "Veda", message});
  log2('/', res.statusCode );
}
router.get('/',  index);


const sql = function(req, res) {
  res.render('test/sql', {title: "Query"});
  log2('/', res.statusCode );
}
router.get('/sql',  sql);



router.post('/query', async function(req, res) {
  let sql = req.body.sql;

  //res.send(sql);
  //res.send('1');

  // try {
  //   const result = await db.query('SELECT count(*) AS cnt FROM users WHERE login = $1', [login]);
  //   res.send(result?.rows[0].cnt);
  // } catch (e) {
  //   console.log('Error: XXX'+ e.message);
  //   res.send('Error: ' + e.message);
  // }

  //db.query(sql, [login])
  db.query(sql)
  //.then (result => res.send(result))
  .then (result => res.send(objs2table(result.rows)))
  .catch (err => res.send('Error: ' + err.message));
 
  // console.log(result?.rows[0]);
  // console.log(result?.rows[0].cnt);

});

// // Вернуть пользователя
// router.get('/user/get_user', async function(req, res) {
//   res.json(req.session.user);
// });


//
//  Преобразовать выборку из БД в HTML-таблицу
//
function objs2table(objs) {
  if (objs.length == 0) 
    return 'x';

  let table = '<table id="table1" name="x333">';
  
  table += '<thead>';

  for(let key in objs[0]) {
    table += '<th>' +key + '</th>';
  }
  table += '</thead>';

  table += '<tbody>';
  for (let i=0; i<objs.length; i++) {
    table += '<tr>';
    let user = objs[i];
    for(let key in user) {
      table += '<td>' +user[key] + '</td>';
    }
    table += '</tr>';
  }

  table += '</tbody>';
  table += '</table>';

  return table;
}
