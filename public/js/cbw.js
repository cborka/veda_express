
async function fetch2() {

  //alert("cbw/fetch2");
  let user = {
    name: 'John',
    surname: 'Smith'
  };
  
  let response = await fetch('http://127.0.0.1:3000/user/isLoginFree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    //headers: { 'Content-Type': 'text/plain'},
    //bbbbb: 'xxx',
    body: JSON.stringify(user)
//    body: 'mode=22' 
  //  body: 'modemode'
  });
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
  
