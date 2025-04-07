//import fetch from 'node-fetch';
import {ServerHost} from '../app.js'

//
// Fetch на сервере (backend)
//
export async function myFetch(url, params) {

  let response;
  
  //console.log('url = ' + url);

  if (url[0] == '/') 
    url = ServerHost + url;

  //console.log('ServerHost = ' + ServerHost);
  //console.log('url = ' + url);

  if (params) {
    response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json'}
    });
  }
  else {
    response = await fetch(url, {
      method: 'get',
//      headers: { 'Content-Type': 'application/json'}
    });
  }

  if(response.ok) {
    let txt = await response.text();
    //console.log('txt2 = ' + txt);
    return txt;
  } else {
    console.log('Ошибка HTTP: ' + response.statusText);
    return 'Ошибка getContent' + response.statusText;
  }
}



export function obj2table(objs) {
  if (objs.length == 0) 
    return 'x';

  let table = '<table id="table1" name="x333">';
  
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '<tr>';
  // table += '<td>xcvb0</td>';
  // table += '<td>xcvb2</td>';
  // table += '</tr>';
  // table += '</table>';
  // return table;
  
  table += '<thead>';

  for(let key in objs[0]) {
    table += '<th>' +key + '</th>';
  }
  table += '</thead>';

  table += '<tbody>';
  for (let i=0; i<objs.length; i++) {
    table += '<tr>';
    let user = objs[i];
    for(let key in user) {
      table += '<td>' +user[key] + '</td>';
    }
    table += '</tr>';
  }

  table += '</tbody>';
  table += '</table>';

  //return 'zxcv';
  return table;

}