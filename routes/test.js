import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
export const router = express.Router();


const qu1 = function(req, res) {
  req.session.name = req.params.name; 
  res.send('n='+req.session.name);
}
const qu = function(req, res) {

  //res.send('qu=' + req.cookies + ',' + req.signedCookies );
  res.render('index', {message: req.session.name});


  //log2('/', res.statusCode );
}
router.get('/qu',  qu);
router.get('/qu1/:name',  qu1);

 


router.get('/err', (req, res, next) => {

  next(new Error('BROKEN next')); 
  //throw new Error('BROKEN') // Express will catch this on its own.
})
 
router.get('/err', (req, res, next) => {
  res.send('BROKEN next'); 
  //throw new Error('BROKEN') // Express will catch this on its own.
})

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
  //res.send(s);
  res.render('index', {title: "ip", message: s});
  log2('ip', res.statusCode);
}


const ip2 = function(req, res) {
  let message = `
  <h3 class="marine">req.ip.</h3>
  <p class="marine">${JSON.stringify(req.ip)}</p>
  `;
  res.render('index', {title: "Veda", message});

//  res.redirect('/hbs');
}


const bulma = function(req, res) {
  //res.send([1,2,3,4].toString());
  res.render('index', {title: "Veda2", layout: "layout_bulma"});
  log2('bulma_layout...', res.statusCode );
}

const applocals = function(req, res) {
  let message = '<pre>' + JSON.stringify(req.app.locals,null,2) + '</pre>';
  res.render('index', {title: "req.app.locals", message});
}

const session_info = function(req, res) {
  let message = '<pre>sessionID: ' + req.sessionID + '<br>' +
                JSON.stringify(req.session, null, 2) + '</pre>';
  res.render('index', {title: "Session_info", message});
}

const show_modal = function(req, res) {
  res.render('test/modal', {title: "Modal window"});
  log2('/modal', res.statusCode );
}

router.get('/ip',  ip);
router.get('/ip', ip2);
router.get('/ip2', ip2);
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
});


router.get('/show_error', function(req, res, next) {
  //res.send('test/fetch');
  res.redirect('back');
});

router.get('/back', function(req, res, next) {
  //res.send('test/fetch');
  res.redirect('back');
});