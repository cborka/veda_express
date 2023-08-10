import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js';
export const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user/login', function(req, res) {
  res.render('user/login');
});

router.get('/user/register', function(req, res) {
  res.render('user/register');
});