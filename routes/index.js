import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js';
export const router = express.Router();

const ip = function(req, res, next) {
  let s = "Your IP Addresss is: " + req.socket.localAddress + '<br>';
  s += 'Remote IP Address is: ' + req.socket.remoteAddress + '<br>';
  s += 'req.ip: ' + req.ip + '<br>';
  s += 'import.meta.url: ' + import.meta.url + '<br>';
  s += 'process.cwd(): ' + process.cwd() + '<br>';
  s += '<a href="/">Home </a><br>';
  //next('route');
  res.send(s);
  log2('ip', res.statusCode);
}

const ip2 = function(req, res) {
  //res.send('next route');
  res.redirect('/hbs');
  log2('redirect /hbs', res.statusCode );
  //res.render('regular');
}


const hbs = function(req, res) {

  res.send([1,2,3,4].toString());
  //res.render('index', {title: "Veda"});
  //res.render('regular');
  log2('Привед медвед, я hbs...', res.statusCode );
  }

const applocals = function(req, res) {
  res.json(req.app.locals);
  log2('applocals', res.statusCode );
  //res.render('regular');
}

router.get('/ip',  ip);
router.get('/ip', ip2);
router.get('/ip2', ip2);
router.get('/hbs', hbs);
router.get('/applocals', applocals);
router.get('/db', db_test);



async function db_test  (req, res, next) {
  const result = await db.query('SELECT * FROM phones WHERE id = 1');
  //log2('db_test');
  res.send(result.rows[0]);
  log2('db_test', res.statusCode);
}

//
router.get('/sendFile', function (req, res, next) {
  var options = {
    root: process.cwd(),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = 'public/favicon.bmp';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    } 
  })
  log2('sendFile ' + fileName, res.statusCode);
})