import  express  from "express";
import md5 from "md5";
//import jwt from "jsonwebtoken";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js'
import * as cbw from '../lib/cbw.js'
//import cors from 'cors';
//import fetchh from 'node-fetch';

export const router = express.Router();


function objs2table(objs) {
  if (objs.length == 0) 
    return 'x';

  let table = '<table>';
  
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb1</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb1</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb1</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '</table>';
  // return table;
  
  table += '<thead>';

  for(let key in objs[0]) {
    table += '<th>' +key + '</th>';
  }
  table += '</thead>';

  for (let i=0; i<objs.length; i++) {
    table += '<tr>';
    let user = objs[i];
    for(let key in user) {
      table += '<td>' +user[key] + '</td>';
    }
    table += '</tr>';
  }


  table += '</table>';

  //return 'zxcv';
  return table;

}



/* GET users listing. */
router.get('/user/list', function(req, res, next) {
  let message = '{"id":"0","login":"Admin1","email":"adm@ma11il.ad","password":"1","password2":"1","test":"144","fio":"1"};'

  db.query('SELECT id, login, fullname, email, phone, notes FROM users', [])
  .then (result => {
    if (result && (result.rows.length > 0)) {
      //req.session.fullname = result.rows[0].fullname;

      // message = '';

      // for(let key in result.rows[0]) {
      //   message += key + '|';
      // }
      // message += '<br>';

      // for (let i=0; i<result.rows.length; i++) {
      //   let user = result.rows[i];
      //   for(let key in user) {
      //     message += user[key] + '|';
      //   }
      //   message += '<br>';
      // }

       message = objs2table(result.rows);

//      res.send('1');
      //res.send(message);
      res.render('index', {title: "Пользователи", message});
      //res.send('Строк: '+result.rows.length);
    }
    else {
      //req.session.user = null;
      delete req.session.user;
      res.send('0');
//      res.send('result is false');
    }
    //res.send(result?.rows[0].fullname)

  })
  .catch (err => { message = err.message;  res.render('index', {title: "Error", message});});



  // res.render('index', {title: "Пользователи", message});

  //res.send('respond with a resource');
  log2('/user/list', res.statusCode);
});

// Логин (авторизация)
router.get('/user/login', function(req, res) {
  res.render('user/login');
});
router.post('/user/login', function(req, res) {
  //res.send('login: '+JSON.stringify(req.body)); // {"login":"bor","password":"123","num":"2"}

  db.query('SELECT id, login, fullname, email, phone, notes FROM users WHERE login = $1 AND password = $2', [req.body.login, md5(req.body.password)])
  .then (result => {
    if (result && (result.rows.length == 1)) {
      //req.session.fullname = result.rows[0].fullname;
      req.session.user = result.rows[0];

      res.send('1');
      //res.send('Строк: '+result.rows.length);
    }
    else {
      //req.session.user = null;
      delete req.session.user;
      res.send('0');
//      res.send('result is false');
    }
    //res.send(result?.rows[0].fullname)

  })
  .catch (err => res.send('Error: ' + err.message));
});

// Выход 
router.get('/user/logout', function(req, res) {
  delete req.session.user;
  res.redirect('/');
});



// Регистрация нового пользователя
router.get('/user/register', function(req, res) {
  res.render('user/register');
});
router.post('/user/register', function(req, res) {
  //res.send('x '+JSON.stringify(req.body));
  // req.body = {"id":"0","login":"Admin1","email":"adm@ma11il.ad","password":"1","password2":"1","test":"144","fio":"1"}

  let sql = `
    INSERT INTO users(
      login, fullname, email, phone, notes, password)
      VALUES ($1, $2, $3, $4, $5, $6);
  `;

  let params = [req.body.login, req.body.fio, req.body.email, '', '', md5(req.body.password)];

  db.query(sql, params)
  // .then (result => res.send('OK'))
    .then (() => {
      log2('Зарегистрирован пользователь '+req.body.login, res.statusCode);
      res.redirect('/user/login')
    })
    .catch (err => res.send('Error: ' + err.message));
});

// Профиль пользователя
// router.get('/user/profile', function(req, res) {
//   res.render('user/profile');
// });

// Не занята ли эта почта
router.post('/user/isEmailFree', async function(req, res) {
  db.query('SELECT count(*) AS cnt FROM users WHERE email = $1', [req.body.email])
  .then (result => res.send(result?.rows[0].cnt))
  .catch (err => res.send('Error: ' + err.message));
});

// Не занят ли этот ник (логин)
//router.post('/user/isLoginFree', cors(), function(req, res) {
router.post('/user/isLoginFree', async function(req, res) {
  let login = req.body.login;

  // try {
  //   const result = await db.query('SELECT count(*) AS cnt FROM users WHERE login = $1', [login]);
  //   res.send(result?.rows[0].cnt);
  // } catch (e) {
  //   console.log('Error: XXX'+ e.message);
  //   res.send('Error: ' + e.message);
  // }

  db.query('SELECT count(*) AS cnt FROM xusers WHERE login = $1', [login])
  .then (result => res.send(result?.rows[0].cnt))
  .catch (err => res.send('Error: ' + err.message));
 
  // console.log(result?.rows[0]);
  // console.log(result?.rows[0].cnt);

});

// Вернуть пользователя
router.get('/user/get_user', async function(req, res) {
  res.json(req.session.user);
});


// ДАЛЕЕ ТЕСТЫ

router.get('/user/isLoginFree', async function(req, res) {
 // let ret = await cbw.myFetch(url, {name: "Bobb123"});
 let ret = await cbw.myFetch('/user/getlogin/1/1');
 //let ret = JSON.stringify(req.headers);
 res.send('Вернулось ' + ret); 
});

router.get('/user/getlogin/:pass/:salt', async function(req, res) {
  res.send('getlogin');
});

router.get('/user/md5/:pass', async function(req, res) {
   res.send(md5(req.params.pass));
});


