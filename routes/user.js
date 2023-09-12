import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js';
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


router.post('/user/isLoginFree', function(req, res) {
//  let login = req.body.login;
//  let name = req.body.name;

//req.body.name = 'zxcv';

//  res.send('user/isLoginFree da?' + req.body);
console.log(JSON.stringify(req.body));
  res.send('user/isLoginFree da?' + JSON.stringify(req.body));
});

