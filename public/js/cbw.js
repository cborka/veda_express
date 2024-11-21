


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
// =========================================  Работа с таблицами  ======================================
//


let td_old_value = ''; // Первоначальное значение ячейки таблицы на случай отмены редактирования

//
// Настройка ширины колонок, установка обработчиков для ячеек таблицы
//
function edit_table4(table_id) {
  let tbl = document.getElementById(table_id);


  let colwidths = [10, 15, 50, 50, 15, 20]; // Будет браться из базы данных
  let tablewidth = 0;
  for (let i = 0; i < colwidths.length; i++) {
    tablewidth += colwidths[i];
  }

  //let ths = document.querySelectorAll('#'+table_id + ' th'); // колонки таблицы
  // ячейки заголовока могут занимать несколько строк, так же одна ячейка может охватывать несколько колонок, поэтому сделал как ниже, а не как выше
  let ths = tbl.tBodies[0].rows[0].cells; // ячеек в первой строке первой секции данных таблицы
  
  //alert('kolonok: ' + ths.length);
  //alert('Секций данных: ' + tbl.tBodies.length);
  //alert('Строк в первой секции данных: ' + tbl.tBodies[0].rows.length);
  //alert('kolonok: ' + tbl.tBodies[0].rows[0].cells.length);
    
  for (let i = 0; i < ths.length; i++) {
  //for (var i = 0; i < 4; i++) {
    ths[i].width = Math.floor((colwidths[i]*100)/tablewidth) + "%"; // Установка ширины колонок в соостветствии с массивом colwidths
  }


  let tds = document.querySelectorAll('td'); // все ячейки всех таблиц документа, однако это слишком, надо переделать для конкретной таблицы
  for (let i = 0; i < tds.length; i++) {
    tds[i].tabIndex = 0;
    tds[i].addEventListener('dblclick', tdDblclick);
    tds[i].onkeyup = tdOnkeyup;
  }
}

//
// По двойному клику на ячейке перевожу её в режим редактирования
//
function tdDblclick() {
  tdEditModeOn(this);  // Перевод в режим редактирования
};

//
// При потере фокуса елемента input
//
function tdInputBlur(input) {
  let td = input.parentNode;                    // Ячейка таблицы в которой находится элемент input
  td.innerHTML = input.value;                   // Сохранение результатов редактирования
  td.addEventListener('dblclick', tdDblclick);  // Восстановление обработчика двойного клика
//  td.focus();                       
}

//
// Перевод ячейки таблицы в режим редактирования
//
function tdEditModeOn(td) {
  let input = document.createElement('input');  // Создание элемента input

  // здесь будет настройка input на конкретные типы данных и так далее

  input.value = td.innerHTML;
  td_old_value = td.innerHTML;
  td.innerHTML = '';
  td.appendChild(input);
  input.focus();
  input.select(); // Выделение значения, иногда надо выделять, иногда нет, поэтому надо сделать флаг в документе, указывающий выделять или нет
  //addEventListener('focus', event => event.target.select())

  input.addEventListener('blur', onInputBlur);
  // input.addEventListener('blur', function() {
  //   td.innerHTML = this.value;
  //   td.addEventListener('dblclick', tdDblclick);
  // });

  input.onkeyup = inputOnkeyup;
  td.removeEventListener('dblclick', tdDblclick); // Убираю обработчик двойного клика на время редактирования

  return input;
}

function onInputBlur() {
  let td = this.parentNode;
  let val = this.value;

  if(val == '123') { // если данные не корректны, то не выходим из режима редактирования, остаёмся на месте
    this.focus();
    return;
  }

  td.innerHTML = this.value;
  td.addEventListener('dblclick', tdDblclick);
}




//
// Обработчик нажания клавиш на input
//
function inputOnkeyup(e) {
  switch (e.key) {
    case "Enter":
      this.parentNode.focus(); // При этом теряется фокус элемента input и срабатывает событие onBlur в котором происходит проверка и сохранение введённых данных 
      //this.blur(); // если оставить эту строку, то не видно куда переходит фокус (какая ячейка становится текущей)
      e.stopPropagation();  // если не остановить, то включится обработчик для ячейки и снова переведёт её в режим редактирования, а нам здесь это не надо
      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      prevRow(this.parentNode).focus();
      break;
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      nextRow(this.parentNode).focus();
      break;
    case "Escape":
    case "Esc":
      this.value = td_old_value;
      //                ed.value = v;
      //                erro('Escape');
      break;

    default:
    // erro(f.keyCode);
  }

  td.addEventListener('dblclick', tdDblclick);
  
  //input.focus();
};


function tdOnkeyup(e) {
  switch (e.key) {
    case "Enter":
      tdEditModeOn(this); 

      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      prevRow(this).focus();
      break;
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      nextRow(this).focus();
      break;
    case "Left":
    case "ArrowLeft": 
      leftCell(this).focus();
      break;
    case "Right":
    case "ArrowRight": 
      rightCell(this).focus();
      break;
    default:
    // erro(f.keyCode);
  }

//  td.addEventListener('dblclick', tdDblclick);
};


//
// Возвращает ячейку таблицы на предыдущей строке
//
function prevRow(td) {
  let row_num = td.parentNode.sectionRowIndex;
  let cell_num = td.cellIndex;

  if (row_num > 0) row_num--;

  //td.innerHTML = row_num + " - " + cell_num;

  return td.parentNode.parentNode.rows[row_num].cells[cell_num];

}

//
// Возвращает ячейку таблицы на следующей строке
//
function nextRow(td) {
  let row_num = td.parentNode.sectionRowIndex;
  let cell_num = td.cellIndex;

  if (row_num <= (td.parentNode.parentNode.rows.length - 1)) row_num++;

  return td.parentNode.parentNode.rows[row_num].cells[cell_num];
}

//
// Возвращает ячейку слева
//
function leftCell(td) {
  let row = td.parentNode;      // текущая строка
  let cell_num = td.cellIndex;

  if (cell_num > 0) cell_num--;

  return row.cells[cell_num];
}

//
// Возвращает ячейку справа 
//
function rightCell(td) {
  let row = td.parentNode;      // текущая строка
  let cell_num = td.cellIndex;

  if (cell_num <= (row.cells.length-2)) cell_num++;

  return row.cells[cell_num];
}


// function focus1() {
  
//   let tbl = document.getElementById(table_id);
  
//   tbl.tBodies[0].rows[0].cells[1].focus();
// }


// Элемент <table>, в дополнение к свойствам, о которых речь шла выше, поддерживает следующие:

//   table.rows – коллекция строк <tr> таблицы.
//   table.caption/tHead/tFoot – ссылки на элементы таблицы <caption>, <thead>, <tfoot>.
//   table.tBodies – коллекция элементов таблицы <tbody> (по спецификации их может быть больше одного).
//   <thead>, <tfoot>, <tbody> предоставляют свойство rows:
  
//   tbody.rows – коллекция строк <tr> секции.
//   <tr>:
  
//   tr.cells – коллекция <td> и <th> ячеек, находящихся внутри строки <tr>.
//   tr.sectionRowIndex – номер строки <tr> в текущей секции <thead>/<tbody>/<tfoot>.
//   tr.rowIndex – номер строки <tr> в таблице (включая все строки таблицы).
//   <td> and <th>:
  
//   td.cellIndex – номер ячейки в строке <tr>.



//     Есть два основных набора ссылок:

// Для всех узлов: parentNode, childNodes, firstChild, lastChild, previousSibling, nextSibling.
// Только для узлов-элементов: parentElement, children, firstElementChild, lastElementChild, previousElementSibling, nextElementSibling.















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