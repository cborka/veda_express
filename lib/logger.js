import { appendFile } from 'node:fs/promises';
import {reqId} from '../app.js';
export let logLevel = 3;

let requestId = 1;

export function log1(req, res, next) {
  //  console.log('class mylogger2============================');

    log2(req, 'use|');
  
    next();
};
  
export function log2(req, msg) {
    console.log(requestInfo(req) + msg);
    log2file(requestInfo(req) + msg);
};
  
//
// Информация о запросе
//
function requestInfo(req) {

  return toYYYYMMDDHHMMSS(new Date()) + '|' + 
//    ++requestId + '|' + 
    reqId + '|' + 
    logLevel + '|' +
    req.method + '|' +
    getIpV4(req.ip) + '|' +
    req.url + '|' 
//    ,req.path + '|' 
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