import { appendFile } from 'node:fs/promises';
import {reqId} from '../app.js';
import { Session } from 'node:inspector';
export let logLevel = 3;

let requestId = 1;
let reqInfo = '';

//
// Лог начала запроса
//
export function log1(req, res, next) {
  //  console.log('class mylogger2============================');

  reqInfo = getReqInfo(req);

  log2('|BEGIN');
  
  next();
};
  
//
//  Логгирование
//
export function log2(msg) {
  let logString = getInfo() + msg;

  console.log(logString);
  log2file(logString);
};
  
//
// Информация о запросе
//
function getReqInfo(req) {
  return  req.method + '|' +
    getIpV4(req.ip) + '|' +
    req.url  
    ;
}
function getInfo(req) {
  let user = 'user'; //Session[user] || '';

  return toYYYYMMDDHHMMSS(new Date()) + '|' + 
    reqId + '|' + 
    logLevel + '|' +
    user + '|' +
    reqInfo + '|' 
    ;
}

 
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
    console.error('there was an error:', error.message);
  }
}