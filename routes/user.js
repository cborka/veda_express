import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js'
import * as cbw from '../lib/cbw.js'
import cors from 'cors';
import fetchh from 'node-fetch';

export const router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

// Логин (авторизация)
router.get('/user/login', function(req, res) {
  res.render('user/login');
});
router.post('/user/login', function(req, res) {
  res.send('login: '+JSON.stringify(req.body));
});

// Регистрация нового пользователя
router.get('/user/register', function(req, res) {
  res.render('user/register');
});
router.post('/user/register', function(req, res) {
  res.send('x '+JSON.stringify(req.body));
  // res.send('user/register post' + req.body);
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

  db.query('SELECT count(*) AS cnt FROM users WHERE login = $1', [login])
  .then (result => res.send(result?.rows[0].cnt))
  .catch (err => res.send('Error: ' + err.message));

  // console.log(result?.rows[0]);
  // console.log(result?.rows[0].cnt);

});




router.get('/user/isLoginFree', async function(req, res) {
 // let ret = await cbw.myFetch(url, {name: "Bobb123"});
 let ret = await cbw.myFetch('/user/getlogin');
 //let ret = JSON.stringify(req.headers);
 res.send('Вернулось ' + ret); 
});

router.get('/user/getlogin', async function(req, res) {
  //  fetch3();
  // res.send('fetch3()');
   res.send('getlogin');
  
});

