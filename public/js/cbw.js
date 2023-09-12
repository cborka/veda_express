//import fetch from 'node-fetch';

async function fetch2() {

  let user = {
    name: 'John',
    surname: 'Smith'
  };
  
  let response = await fetch('/user/isLoginFree', {
    method: 'POST',
//    headers: { 'Content-Type': 'application/json'},
    headers: { 'Content-Type': 'text/plain'},
//    body: JSON.stringify(user)
    body: 'mode=22' 
  //  body: 'modemode'
  });
  //alert(response.message);
  
  
     // let response = await fetch('/user/isLoginFree');
  
      if(response.ok) {
      let txt = await response.text();
      alert(txt);
      } else {
      alert('Ошибка HTTP: ' + response.statusText);
      }
  }
  
