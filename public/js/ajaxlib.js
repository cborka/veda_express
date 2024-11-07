function show_msg(element_id, message)
{
  document.getElementById(element_id).innerHTML = message;
}

function show_info(message)
{
  show_msg("info", message);
}

function show_error(message)
{
  show_msg("error", message);
  //document.getElementById("error").innerHTML=message;
}

//
function check_error(message)
{
  if (message[0] == 'E') {
    show_msg("error", message);
    throw new Error(message);
    //throw new Error('ошибочка');
  }
}

function onERRdefault(message)
{
  show_error(message);
}

//
// Запуск асинхронного запроса на выполнение
//
function doQuery (url, onOK, params, async = true)
{
  let xhr = new XMLHttpRequest();

  xhr.timeout = 30000; // 30 секунд (в миллисекундах)

  xhr.ontimeout = function() {
    alert( 'Извините, запрос превысил максимальное время '+xhr.timeout/1000+" секунд." );
  }

  xhr.onreadystatechange = function()
  {
    if (xhr.readyState != 4)
      return;

    if (xhr.status != 200)
    {
      onERRdefault('Ошибка:'+xhr.status + ': ' + xhr.statusText);  // обработать ошибку
    }
    else
    {
      onOK(xhr.responseText);   // вывести результат //(xhr.responseText);
    }
  }

  if (params == '' || params == undefined) {
    xhr.open("GET", url, async);
    xhr.send();
  }
  else {
    xhr.open("POST", url, async);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }
}


//
// Эмуляция Fetch через XMLHttpRequest (пока нигде не используется, возможно не работает)
//
//function cbwFetch (url, onOK, params, async = true)
function cbwFetch (url, params)
{
  return new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();

    xhr.timeout = 30000; // 30 секунд (в миллисекундах)

    xhr.ontimeout = function() {
      alert( 'Запрос превысил максимальное время '+xhr.timeout/1000+" секунд." );
    }

    xhr.onreadystatechange = function()
    {
      if (xhr.readyState != 4)
        return;

      if (xhr.status != 200)
      {
        onERRdefault('Ошибка:'+xhr.status + ': ' + xhr.statusText);  // обработать ошибку
      }
      else
      {
        onOK(xhr.responseText);   // вывести результат //(xhr.responseText);
      }
    }

    //if (params == '' || params == undefined) {
    if (!params) {
      xhr.open("GET", url, async);
      xhr.send();
    }
    else {
      xhr.open("POST", url, async);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    }
  })
}
