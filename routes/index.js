import  express  from "express";
import {log2} from '../lib/logger.js';
import * as db from '../lib/db_lib.js';
export const router = express.Router();


const index = function(req, res) {
  let message = `
  <h3 class="marine">Новый проект.</h3>
  <p class="marine">Чистые HTML, CSS, JS + NodeJS Express</p>
  `;
  res.render('index', {title: "Veda", message});
  log2('/', res.statusCode );
}
router.get('/',  index);