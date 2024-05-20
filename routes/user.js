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


  console.log('name= ' + req.body.name);
  res.send(req.body.name);
  //res.send('isLoginFree: '+JSON.stringify(req.body));
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

