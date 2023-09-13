import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js'
import cors from 'cors';;
import fetch from 'node-fetch';

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


router.post('/user/isLoginFree', cors(), function(req, res) {
//  let login = req.body.login;
//  let name = req.body.name;

//req.body.name = 'zxcv';

//  res.send('user/isLoginFree da?' + req.body);
console.log(JSON.stringify(req.body));
  res.send('user/isLoginFree da?'  + JSON.stringify(req.body));
  //res.send('user/isLoginFree da?' + req.bbbbb + JSON.stringify(req.body));
});

router.get('/user/isLoginFree', async function(req, res) {
//  fetch3();
//  res.send('fetch3()');
 res.send(await fetch3());

});


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