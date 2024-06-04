import pkg from 'pg';
const { Pool } = pkg;

//import { Pool } from 'pg';
//console.log('DB_HOST = ' + process.env.DB_HOST);
 
export const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})