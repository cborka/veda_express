import {log2, log2file} from './logger.js';
import {pool} from '../db.js';

//
// Запрос к базе данных
//
export const query = async (text, params, callback) => {

  // return pool.query(text, params, callback)

  // if (text.trim().slice(0, 15) == 'INSERT INTO log')
  //   console.log(text.trim().slice(0, 15));

  //console.log('dbparams = ' + params);

  let res;

  const start = Date.now();
  try {
    res = await pool.query(text, params);

    const duration = Date.now() - start; 

    // Вывод логов в консоль и в файл
    console.log(`${text}, [${params}], ${duration} ms, ${res.rowCount} rows`);
    log2(`${text}, ${duration} ms, ${res.rowCount} rows`, 102); // 102 - http code - processing

  } catch (error) {
    let msg = 'Ошибка SQL: ' + error.message + ' >> ' + text + ', [' + params + ']';
    console.error(msg);
    log2(msg, error.code);
    // console.error(JSON.stringify(error));
    // console.error('Ошибка SQL: ', error.message, text,'---', params);
    // log2('Ошибка SQL: ' + error.message + ' >> ' + text, '---', params);
    throw error; 
  }

  return res;
}

//
// Запись в журнал - таблицу БД (Не отмечаем в журнале записи в сам журнал)
//
export const log2dblog = async (text, params, callback) => {
  let res;
  res = await pool.query(text, params);

  // try {
  //   res = await pool.query(text, params);
  // } catch (error) {
  //   console.error('Ошибка logSQL:', error.message);
  //   log2file('Ошибка logSQL: ' + error.message);
  //   throw error;
  // }

  return res;
}
