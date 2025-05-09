import { appendFile } from 'node:fs/promises';
import * as db from './db_lib.js';
import {reqId} from '../app.js';
//import { Session } from 'node:inspector';
export let logLevel = 3; // Пока не используется и просто равен трём

let requestInfo = '';
let userLogin = 'guest';

//
// Лог начала запроса, вызывается из app.js
//
export function log1(req, res, next) {
  
  // Пользователь
  if (req.session && req.session.user?.login) {
    userLogin = req.session.user?.login;
  }
  else {
    userLogin = 'guest';
  }

  // Информация о запросе. Используется и в последующих записях в журнал для этого запроса
  requestInfo = req.method + '|' + getIpV4(req.ip) + '|' + decodeURIComponent(req.url);

  log2('BEGIN');
  
  next();
};

//
//  Запись в журнал
//
export function log2(msg, status) {
  if (!status) status = '...'; 

  let logString = getInfo() + status + '|' + msg;

  //console.log(logString);

  log2file(logString);
  log2db(logString);
};

function getInfo(req) {

  return toYYYYMMDDHHMMSS(new Date()) + '|' + 
    reqId + '|' + 
    logLevel + '|' + // Пока не используется и просто равен трём
    userLogin + '|' +
    requestInfo + '|'
    ;
}

//
// Вспомогательные функции
//

// Вычленяем последний элемент из строки вида "::ffff:127.0.0.1"
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
export async function log2file(str) {
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
  // let fileName = './log/access'+toYYYYMMDD(new Date())+'.log';

  // console.log(str);
  // console.log(str.split('|'));
  // console.log('---');

  let sql = `
    INSERT INTO log 
             (dt, req_num, log_level, "user", method, ip, url, status, msg) 
      VALUES ($1, $2,       $3,         $4,     $5,   $6, $7,   $8,     $9)`;

  try {
    const result = await db.log2dblog(sql, str.split('|'));
    //console.log(`Добавлено строк: ${result.rowCount}`);
  } catch (error) {
    let err_str = 'log2db: Ошибка добавления в таблицу log: '
     + error.message + ' >\n' + str;
    console.error(err_str);
    log2file(err_str)
//    throw error;
  }
}