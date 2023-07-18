import {log2} from '../lib/logger.js';
import pkg from 'pg';
const { Pool } = pkg;

//import { Pool } from 'pg';
//console.log('DB_HOST = ' + process.env.DB_HOST);
 
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

export const query = async (text, params, callback) => {

  // return pool.query(text, params, callback)

  // if (text.trim().slice(0, 15) == 'INSERT INTO log')
  //   console.log(text.trim().slice(0, 15));

  //console.log(params);

  let res;

  const start = Date.now();
  try {
//    console.log('sql-params='+params);
    res = await pool.query(text, params);
//    console.log('sql-params2='+params);
  
    // Если не вставка в лог, то вставка в лог
    if (text.trim().slice(0, 15) != 'INSERT INTO log') {
      const duration = Date.now() - start; 
//      console.log(`${text}, ${duration} ms, ${res.rowCount} rows`);
      log2(`${text}, ${duration} ms, ${res.rowCount} rows`);
    }
  } catch (error) {
    console.error('sql-params2='+params);
    console.error('Ошибка SQL:', error.message, text,'---', params);
    log2('Ошибка SQL:', error.message, text,'---', params);
  }


  return res;
}
