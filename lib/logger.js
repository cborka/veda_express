import { appendFile } from 'node:fs/promises';
import * as db from '../lib/db.js';
import {reqId} from '../app.js';
import { Session } from 'node:inspector';
export let logLevel = 3;

let requestInfo = '';

//
// Лог начала запроса
//
export function log1(req, res, next) {
  //  console.log('class mylogger2============================');

  // Используется и в последующих записях в журнал для этого запроса
  requestInfo = getRequestInfo(req);

  log2('BEGIN');
  
  next();
};

 
function getInfo(req) {
  let user = 'user'; //Session[user] || '';

  return toYYYYMMDDHHMMSS(new Date()) + '|' + 
    reqId + '|' + 
    logLevel + '|' +
    user + '|' +
    requestInfo + '|'
    ;
}
// Информация о запросе
function getRequestInfo(req) {
  //console.log( decodeURIComponent(req.url));

  return  req.method + '|' +
    getIpV4(req.ip) + '|' +
    decodeURIComponent(req.url)  
    ;
} 
//
//  Логгирование
//
export function log2(msg, status) {
  if (!status) status = '...'; 

  let logString = getInfo() + status + '|' + msg;

  //console.log(logString);

  log2file(logString);
  log2db(logString);
};
  


//
// Вычленяем последний элемент из строки вида "::ffff:127.0.0.1"
//
function getIpV4(ip) {
  // split(':') - разбиваем строку "::ffff:127.0.0.1" на массив строк, 
  // slice(-1) - обрезаем массив до одного последнего элемента и
  // берём этот элемет массива, который теперь первый и единственный 
  return ip.split(':').slice(-1)[0]; 
};

// Возвращает дату-время в виде ГГГГ-ММ-ДД ЧЧ:ММ:СС.МС
function toYYYYMMDDHHMMSS(s)
{
  return s.getFullYear() + '-'+ ("0"+(1+s.getMonth())).slice(-2) + '-' + ("0"+s.getDate()).slice(-2)+" "+
    ("0"+s.getHours()).slice(-2)+":"+("0"+s.getMinutes()).slice(-2)+":"+("0"+s.getSeconds()).slice(-2) +"."+s.getMilliseconds();
}

// Возвращает дату в виде ГГГГ-ММ-ДД
function toYYYYMMDD(s)
{
  return s.getFullYear() + '-'+ ("0"+(1+s.getMonth())).slice(-2) + '-' + ("0"+s.getDate()).slice(-2);
}


//
// Добавление строки протокола в файл
//
async function log2file(str) {
  let fileName = './log/access'+toYYYYMMDD(new Date())+'.log';

  try {
    await appendFile(fileName, str+'\n');
    //console.log('successfully appended to '  + fileName);
  } catch (error) {
    console.error('log2file: error:', error.message);
  }
}

//
// Добавление строки протокола в базу данных
//
async function log2db(str) {
  let fileName = './log/access'+toYYYYMMDD(new Date())+'.log';

  // console.log(str);
  // console.log(str.split('|'));
  // console.log('---');

  let sql = `
    INSERT INTO log 
             (dt, req_num, log_level, "user", method, ip, url, status, msg) 
      VALUES ($1, $2,       $3,         $4,     $5,   $6, $7,   $8,     $9)`;

  try {
    const result = await db.query(sql, str.split('|'));
    //console.log(`Добавлено строк: ${result.rowCount}`);
  } catch (error) {
    console.error('log2db: Ошибка добавления в таблицу log:', error.message);
  }
}