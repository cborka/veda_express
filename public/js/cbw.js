


//
// Fetch на клиенте (frontend)
//
async function myFetch2(url, params) {

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
    });
  }

  if(response.ok) {
    let txt = await response.text();
    // alert('txt2 = ' + txt);
    check_error(txt);
    return txt;
  } else {
    console.log('Ошибка HTTP: ' + response.statusText);
    return 'Ошибка getContent' + response.statusText;
  }
}
  
//
// Работа с таблицами
//





















/*
// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ
window.addEventListener("DOMContentLoaded", () => {
  for (let cell of document.querySelectorAll("#demo td")) {
    cell.ondblclick = () => { editable.edit(cell); };
    }
  });

  let editable = {
    
    edit: (cell) => {               // "ПРЕОБРАЗОВАТЬ" В РЕДАКТИРОВАННУЮ ЯЧЕЙКУ
      cell.ondblclick = "";         // УДАЛИТЬ "ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ"
      cell.contentEditable = true;  // РЕДАКТИРУЕМОЕ СОДЕРЖИМОЕ
      cell.focus();                 // "ОТМЕТИТЬ" ТЕКУЩУЮ ВЫБРАННУЮ ЯЧЕЙКУ
      cell.classList.add("edit");
      editable.selected = cell;

      // НАЖМИТЕ ENTER ИЛИ ЩЕЛКНИТЕ ВНЕ, ЧТОБЫ ЗАВЕРШИТЬ РЕДАКТИРОВАНИЕ
      window.addEventListener("click", editable.close);

      cell.onkeydown = (evt) => { if (evt.key=="Enter") {
        editable.close(true);
        return false;
      }};
    },

    // ЗАВЕРШИТЬ "РЕЖИМ РЕДАКТИРОВАНИЯ"
    selected: null, // текущая выбранная ячейка
    close: (evt) => { if (evt.target != editable.selected) {
    // ДЕЛАЙТЕ ВСЕ, ЧТО ВАМ НУЖНО
    // проверить значение?
    // отправить значение на сервер?
    // обновить расчеты в таблице?
    // УДАЛИТЬ "РЕДАКТИРОВАНИЕ"
    window.getSelection().removeAllRanges();
    editable.selected.contentEditable = false;
    // ВОССТАНОВИТЬ КЛИК-СЛУШАТЕЛИ
    window.removeEventListener("click", editable.close);
    let cell = editable.selected;
    cell.ondblclick = () => { editable.edit(cell); };
    // "СНЯТЬ ПОМЕТКУ" ТЕКУЩЕЙ ВЫБРАННОЙ ЯЧЕЙКИ
    editable.selected.classList.remove("edit");
    editable.selected = null;
    }}
  };
  */