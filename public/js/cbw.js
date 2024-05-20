
async function fetch2(url, params) {

  if (params) {
    response = await fetch(url, {
      method: 'post',
      body: params,
      headers: { 'Content-Type': 'text/plain'}
    });
  }
  else {
    response = await fetch(url, {
      method: 'get',
//      headers: { 'Content-Type': 'application/json'}
    });
  }

  
  //let response = await fetch('http://127.0.0.1:3000/user/isLoginFree', {
  // let response = await fetch('/user/isLoginFree', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json'},
    //headers: { 'Content-Type': 'text/plain'},
    //bbbbb: 'xxx',
    // body: JSON.stringify(user)
//    body: 'mode=22' 
  //  body: 'modemode'
  // });
  //alert(response.message);
  
  
     // let response = await fetch('/user/isLoginFree');
     //let txt = await response.text();
     alert(await response.text());
      // if(response.ok) {
      // let txt = await response.text();
      // alert(txt);
      // } else {
      // alert('Ошибка HTTP: ' + response.statusText);
      // }
  }
  
