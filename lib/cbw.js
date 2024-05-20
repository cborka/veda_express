//import fetch from 'node-fetch';
import {ServerHost} from '../app.js'

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
