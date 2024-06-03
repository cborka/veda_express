import  express  from "express";
//import { v4 as uuidv4 } from 'uuid';
import {log2} from '../lib/logger.js';
import * as db from '../lib/db.js';
export const router = express.Router();



const qu1 = function(req, res) {
  req.session.name = 'my name is Боря'; 
  res.send('n='+req.session.name);
}
const qu = function(req, res) {

  //res.send('qu=' + req.cookies + ',' + req.signedCookies );
  res.send(req.session.name);


  //log2('/', res.statusCode );
}
router.get('/qu',  qu);
router.get('/qu1',  qu1);

 





const ip = function(req, res, next) {
  let s = "Your IP Addresss is: " + req.socket.localAddress + '<br>';
  s += 'Remote IP Address is: ' + req.socket.remoteAddress + '<br>';
  s += 'req.ip: ' + req.ip + '<br>';
  s += 'req.socket.remoteAddress: ' + req.socket.remoteAddress + '<br>';
  s += 'req._remoteAddress: ' + req._remoteAddress + '<br>';
  s += '(req.connection && req.connection.remoteAddress): ' + (req.connection && req.connection.remoteAddress) + '<br>';
  s += 'import.meta.url: ' + import.meta.url + '<br>';
  s += 'process.cwd(): ' + process.cwd() + '<br>';
  s += 'req.headers[x-forwarded-for]: ' + req.headers + '<br>';
  s += 'res._startAt: ' + res._startAt + '<br>';
  s += 'req._startAt: ' + req._startAt + '<br>';
  s += 'req._startAt[0]: ' + req._startAt[0] + '<br>';
  s += 'req._startAt[1]: ' + req._startAt[1] + '<br>';
  s += '<a href="/">Home </a><br>';
  //next('route');
  res.send(s);
  log2('ip', res.statusCode);
}

const index = function(req, res) {
  res.render('index', {title: "Veda", message2: "Hello!"});
  log2('/', res.statusCode );
}

const ip2 = function(req, res) {
  //res.send('next route');
//  console.log(req);
//  res.send(req.body);
  res.json(req.body);

//  res.redirect('/hbs');
//  log2('redirect /hbs', res.statusCode );
  //res.render('regular');
}


const hbs = function(req, res) {
  //res.send([1,2,3,4].toString());
  res.render('index', {title: "Veda"});
  //res.render('regular');
  log2('Привед< медвед, я hbs...', res.statusCode );
}

const bulma = function(req, res) {
  //res.send([1,2,3,4].toString());
  res.render('index', {title: "Veda2", layout: "layout_bulma"});
  //res.render('regular');
  log2('bulma_layout...', res.statusCode );
}
 const applocals = function(req, res) {
  res.json(req.app.locals);
  log2('applocals', res.statusCode );
  //res.render('regular');
}

const session_info = function(req, res) {
  res.write('<p>sessionID: ' + req.sessionID + '</p>');
  res.write('<p>maxAge: ' + req.session.cookie.maxAge + '</p>');
  res.write('<p>originalMaxAge: ' + req.session.cookie.originalMaxAge + '</p>');
  res.write('<p>name: ' + req.session.name + '</p>');
  res.write(JSON.stringify(req.session, null, 2));
  res.end();
  //res.json(req.session);
  log2('session_info', res.statusCode );
}

const show_modal = function(req, res) {
  res.render('test/modal', {title: "Modal window"});
  log2('/modal', res.statusCode );

}

router.get('/',  index);
router.get('/ip',  ip);
router.get('/ip', ip2);
router.get('/ip2', ip2);
router.get('/hbs', hbs);
router.get('/bulma', bulma);
router.get('/applocals', applocals);
router.get('/db', db_test);
router.get('/session_info', session_info);
router.get('/modal', show_modal);

async function db_test  (req, res, next) {
  try {
    const result = await db.query('SELECT * FROM phones WHERE id = 1');
    res.send(result?.rows[0]);
  }
  catch (error) {
     res.statusCode = '500';
     res.send('Ошибка БД');
  } finally {
       log2('db_test', res.statusCode);
   }
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

router.get('/promises', function(req, res, next) {
  res.render('test/promises');
});

router.get('/testfetch', function(req, res, next) {
  res.send('test/fetch');
  log2('testfetch ', res.statusCode);
});

router.get('/testhbs', function(req, res, next) {

  let date = new Date();
			
  let year  = date.getFullYear();
  let month = date.getMonth() + 1;
  let day   = date.getDate();
  
  let dt = year + '-' + month + '-' + day;


	res.render('test/hbs', {
    dt: dt,
		user: {name: 'john', age: 30}
	});

//  res.render('test/hbs', {text: '<b>aaa</b>'});
  log2('testhbs ', res.statusCode);
});


router.get('/show_error', function(req, res, next) {
  //res.send('test/fetch');
  res.redirect('back');
});

router.get('/back', function(req, res, next) {
  //res.send('test/fetch');
  res.redirect('back');
});