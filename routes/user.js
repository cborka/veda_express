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

router.get('/user/login', function(req, res) {
  res.render('user/login');
});
router.post('/user/login', function(req, res) {
  res.send('login: '+JSON.stringify(req.body));
});

router.get('/user/register', function(req, res) {
  res.render('user/register');
});
router.post('/user/register', function(req, res) {
  res.send('x '+JSON.stringify(req.body));
  // res.send('user/register post' + req.body);
});

router.get('/user/profile', function(req, res) {
  res.render('user/profile');
});


//router.post('/user/isLoginFree', cors(), function(req, res) {
router.post('/user/isLoginFree', function(req, res) {
  let login = req.body.login;

  res.send(req.body.name);
  //res.send('isLoginFree: '+JSON.stringify(req.body));
});

router.get('/user/isLoginFree', async function(req, res) {
//  fetch3();
// let url = 'https://' + req.hostname + req.url;
 //let url = 'http://' + req.hostname + ':' + '3000' + req.url;
 //let url = 'http://127.0.0.1:3000/user/isLoginFree';
 //let ret = await cbw.getContent(url, {name: "Bobbb"});
 let ret = await fetch5();
 res.send('Вернулось ' + ret);
 //res.send('Вернулось ' + req);

});

router.get('/user/getlogin', async function(req, res) {
  //  fetch3();
  // res.send('fetch3()');
   res.send('getlogin');
  
});

async function fetch5() {
  const response = await fetch('http://127.0.0.1:3000/user/getlogin');
  
  if(response.ok) {
    let txt = await response.text();
//    console.log('body = ' + JSON.stringify(user));
    console.log('txt = ' + txt);
    return txt;
  } else {
    console.log('Ошибка HTTP: ' + response.statusText);
    return 'ErrorXXX';
  }
}

async function fetch4() {
  const user = {
    name: 'John',
    surname: 'Smith'
  };
  
  const response = await fetch('http://127.0.0.1:3000/user/isLoginFree', {
    method: 'post',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json'},
    //mode: "same-origin",
    //credentials: "same-origin",
  });
  
  if(response.ok) {
    let txt = await response.text();
//    console.log('body = ' + JSON.stringify(user));
    console.log('txt = ' + txt);
    return txt;
  } else {
    console.log('Ошибка HTTP: ' + response.statusText);
    return 'ErrorXXX';
  }
}

async function fetch3() {
  let user = {
    name: 'John',
    surname: 'Smith'
  };
  
  let response = await fetch('http://127.0.0.1:3000/user/isLoginFree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    mode: "same-origin",
    credentials: "same-origin",
    body: JSON.stringify(user)
  });
 
  if(response.ok) {
    let txt = await response.text();
    console.log('body = ' + JSON.stringify(user));
    console.log('txt = ' + txt);
    return txt;
  } else {
    alert('Ошибка HTTP: ' + response.statusText);
  }
}