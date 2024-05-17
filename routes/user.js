import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js'
import cors from 'cors';;
import fetchh from 'node-fetch';

export const router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user/login', function(req, res) {
  res.render('user/login');
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
//  let name = req.body.name;
  let a = req.body.a;

//req.body.name = 'zxcv';

//  res.send('user/isLoginFree da?' + req.body);
//console.log('req.body=' + JSON.stringify(req.body));
console.log('req.body=' + JSON.stringify(req.body));
console.log('a=' + a);
  res.send('user/isLoginFree da?'  + JSON.stringify(req.body));
//  res.send(JSON.stringify(req.body));
  //res.send('user/isLoginFree da?' + req.bbbbb + JSON.stringify(req.body));
});

router.get('/user/isLoginFree', async function(req, res) {
//  fetch3();
// res.send('fetch3()');
 res.send(await fetch4());

});


async function fetch4() {
  const user = {
    name: 'John',
    surname: 'Smith'
  };
  
  // const response = await fetch('https://httpbin.org/post', {
  //   method: 'post',
  //   body: JSON.stringify(body),
  //   headers: {'Content-Type': 'application/json'}
  // });
  // const data = await response.json();

  const body = {a: 1};
//   const response = await fetchh('https://httpbin.org/post', {
   const response = await fetchh('http://127.0.0.1:3000/user/isLoginFree', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json'}
//    headers: { 'Content-Type': 'multipart/form-data'}
//    mode: "same-origin",
//    credentials: "same-origin",
  });
  
  if(response.ok) {
    let txt = await response.text();
//    console.log('body = ' + JSON.stringify(user));
    console.log('txt = ' + txt);
//    return '['+JSON.stringify(txt)+']';
    return txt;
  } else {
    alert('Ошибка HTTP: ' + response.statusText);
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