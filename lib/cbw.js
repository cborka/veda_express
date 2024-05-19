import fetch from 'node-fetch'; 
//import cors from 'cors';

export async function getContent(url, params) {

  let response;

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
    console.log('txt = ' + txt);
    return txt;
  } else {
    console.log('Ошибка HTTP: ' + response.statusText);
    return 'Ошибка getContent' + response.statusText;
  }
}