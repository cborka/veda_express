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
  // log2(text);
  // return pool.query(text, params, callback)

  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start; 
  log2(`${text}, ${duration} ms, ${res.rowCount} rows`);
  return res;
}
