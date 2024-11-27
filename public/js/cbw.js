


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
let td_current = 0;

//
// Настройка ширины колонок, установка обработчиков для ячеек таблицы
//
function edit_table(table_id) {
  let tbl = document.getElementById(table_id);

  // Настройка ширины колонок
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
    ths[i].width = Math.floor((colwidths[i]*100)/tablewidth) + "%"; // Установка ширины колонок в соостветствии с массивом colwidths
  }


  // Настройка строк таблицы, присваиваем уникальный id для каждой строки, устнавилваем флаг changed (строка изменена)
  let trs = document.querySelectorAll('tbody tr'); // строки всех таблиц документа
  //let trs = document.querySelectorAll('#'+table_id+' tr'); // строки таблицы
  for (let i = 0; i < trs.length; i++) {
    trs[i].id = i; // надо чтобы не совпадало у разных таблиц документа для этого можно сделать отдельный цикл по ВСЕМ строкам таблиц документа
    trs[i].changed = false;
  }

  // Установка обработчиков для ячеек таблицы
  let tds = document.querySelectorAll('td'); // все ячейки всех таблиц документа, однако это слишком, надо переделать для конкретной таблицы
  //let tds = document.querySelectorAll('#'+table_id+' td'); // ячейки для конкретной таблицы
  for (let i = 0; i < tds.length; i++) {
    tds[i].tabIndex = 0;
    tds[i].addEventListener('dblclick', tdDblclick);
    tds[i].addEventListener('focusout', onTdFocusout);
    tds[i].addEventListener('focus', onTdFocus);
    //tds[i].addEventListener('blur', onTdFocusout);      // вместо blur стоит focusout, потому что он всплывает (из дочернего input)
    tds[i].onkeyup = tdOnkeyup;
  }
}

//
// По двойному клику на ячейке перевожу её в режим редактирования
//
function tdDblclick() {
  tdSetEditMode(this);  // Перевод в режим редактирования
};

//
// При потере фокуса елемента input
//
// function tdInputBlur(input) {
//   let td = input.parentNode;                    // Ячейка таблицы в которой находится элемент input
//   if (td.innerHTML == input.value) {
//     log('save ' + input.value);
//     td.innerHTML = input.value;                   // Сохранение результатов редактирования
//     td.parentNode.changed = true;                 // Признак, что строка изменена и её надо сохранить в базе данных
//   };                   // Сохранение результатов редактирования
//   td.addEventListener('dblclick', tdDblclick);  // Восстановление обработчика двойного клика
// //  td.focus();                       
// }

//
// Перевод ячейки таблицы в режим редактирования
//
function tdSetEditMode(td) {
  let input = document.createElement('input');  // Создание элемента input

  // здесь будет настройка input на конкретные типы данных и так далее

  input.value = td.innerHTML;
  input.id = 'tdinput';
  //input.i
  td_old_value = td.innerHTML;
  td.innerHTML = '';
  td.appendChild(input);
  input.focus();
  input.select(); // Выделение значения, иногда надо выделять, иногда нет, поэтому надо сделать флаг в документе, указывающий выделять или нет
  //addEventListener('focus', event => event.target.select())

  // Событие 'focusout' всплывает, в отличие от события 'blur'
  input.addEventListener('focusout', onInputFocusout);

  input.onkeyup = inputOnkeyup;
  td.removeEventListener('dblclick', tdDblclick); // Убираю обработчик двойного клика на время редактирования

  return input;
}

// 
// При уходе с элемента ввода (input теряет фокус)
//
function onInputFocusout(e) {
  log('---> onInputFocusout()');
  let td = this.parentNode; // Текущая ячейка
  let val = this.value;     //

  if (val != td_old_value) { // Если значение изменилось, сохраняем
   
    if(val == '123') { // если данные не корректны, то не выходим из режима редактирования, остаёмся на месте
      log('data error ' + val);
      this.focus();
      e.stopPropagation();
//      return;
    } else {
      log('saving ' + val);  
      td.parentNode.changed = true;         // Признак, что строка изменена и её надо будет сохранить в базе данных при уходе с этой строки
    }
  };                   

  // Сохранение результатов редактирования, 
  //    это надо сделать в любом случае, так как выходим из режима редактирования ячейки 
  //    и надо вместо элемента input, который там находится в режиме редактирования, просто присвоить ячейке значение
  //    сам input должен будет очиститься внутренним механизмом очистки памяти javascript, так как на него больше не останется ссылок

  //td.innerHTML = this.value;  
  //td.addEventListener('dblclick', tdDblclick);

  // Перенёс эти два действия (выше) в событие onTdFocusout (на ячейке таблицы), 
  // для того, чтобы можно было идентифицировать ячейку таблицы в которой находится input
  // а иначе input.parent в обработчике onTdFocusout будет равен null и нельзя будет найти к какой ячейке относится этот input 
}

function onTdFocus(e) {
  //log('---> onTdFocus ' + e.target.parentNode?.id);
  //log('---> onTdFocus ' + this.parentNode?.id);
  td_current = this;
}  

//
// При уходе с текущей ячейки таблицы
//
function onTdFocusout(e) {
  log('---> onTdFocusout ' + e.target);
  let td_src;     // Ячейка таблицы с которой уходим (которая теряет фокус)
  let td_dest;    // Куда уходим, на какой элемент, это не обязательно ячейка таблицы

  if (e.target == "[object HTMLTableCellElement]") {    // ячейка таблицы потеряла фокус (ушли с ячейки таблицы)
    // log("ячейка");
    td_src = e.target;
    td_dest = e?.relatedTarget; 
  } else if (e.target == "[object HTMLInputElement]") { // событие всплыло из элемента input, который потерял фокус, закончили редактирование
    // log("поле ввода = " + e.target.parentNode)
    td_src = e.target.parentNode;                       // Запоминаем ячейку
    td_src.innerHTML = e.target.value;                  // Запоминаем содержимое ячейки
    td_src.addEventListener('dblclick', tdDblclick);    // Восстанавливаем обработчик 

    td_dest = e?.relatedTarget;                         // Находим куда перешли с этой ячейки (если перешли)

  }  else {
    // Не должно досюда дойти
    log("stopPropagation")
    e.stopPropagation();
  }

  let s = td_src?.parentNode?.id;  // Идентификатор текущей строки таблицы (она родитель текущей ячейки)
  let t = td_dest?.parentNode?.id; // Идентификатор строки на которую ушли
  if(!t) t = td_dest?.id;          // Если это null, то ушли не на ячейку таблицы, возможно фокус перешёл на input (перешли в режим редактирования)

//  log(`Ушёл ${s} -> ${t}`);

  if ((s != t)                // Если ушли на другую строку (идентификаторы строк не равны)
    && (t != 'tdinput')) {    //   а не перешли в режим редактирования 
                              //   (в этом случае фокус переноситься на input в этой же ячейке таблицы и идентификаторы так же не равны, но строка та же самая)
    if (td_src?.parentNode?.changed) {        // если строка, с которой уходим, изменена
      log('Строка '+ s + ' изменена.');
      if (trSave(td_src.parentNode)) {        // сохраняем данные этой строки в базе данных
        td_src.parentNode.changed = false;    // и ставим отметку, что строка не изменена (не требует сохранения в бд)
      } else {
        log("Ошибка сохранения строки " + s); // если не удалось сохранить данные
        td_src.focus();                       // возвращаем фокус этой строке, возможно ввели неверные данные и надо исправить
      }
    }
//    log('Другая строка '+ td_src?.parentNode?.id + ' - ' + td_src?.parentNode?.changed);
  }
  //e.stopPropagation();
}

//
// Сохранение строки в базе данных (заглушка)
//
function trSave(tr) {
  return tr.cells[0].innerHTML != '11'; // успешно ли прошло сохранение
}

//
// Обработчик нажания клавиш на input
//
function inputOnkeyup(e) {
  switch (e.key) {
    case "Enter":
      this.parentNode.focus(); // При этом теряется фокус элемента input и срабатывает событие onInputFocusout в котором происходит проверка и сохранение введённых данных 
      //this.blur(); // если оставить эту строку, то не видно куда переходит фокус (какая ячейка становится текущей)
      //e.stopPropagation();  // если не остановить, то включится обработчик для ячейки и снова переведёт её в режим редактирования, а нам здесь это не надо
      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      //prevRow(this.parentNode).focus();
      break;
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      //nextRow(this.parentNode).focus();
      break;
    case "Escape":
    case "Esc":
      this.value = td_old_value;
      this.parentNode.focus();
      break;
    default:
    // erro(f.keyCode);
  }
  e.stopPropagation();  
  td.addEventListener('dblclick', tdDblclick);
  
  //input.focus();
};

//
// Обработчик нажания клавиш на td (ячейке таблицы)
//
function tdOnkeyup(e) {
  switch (e.key) {
    case "Enter":
      tdSetEditMode(this); 
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
    // erro(e.key);
  }
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


function insert_row() {
  log('---> insert_row before ' + td_current.parentNode?.id);
  log('tbody =  ' + td_current.parentNode?.parentNode);
  log('table.id =  ' + td_current.parentNode?.parentNode?.parentNode?.id);

}



//
// лог для отладочных сообщений
//
function log(message) {
  let l = document.getElementById('log');
  //l.innerHTML = message +  '<br>\n' + l.innerHTML ;
  l.innerHTML = message +  '\n' + l.innerHTML ;
  //l.innerHTML += ('\n' + message);
  //document.getElementById('log').innerHTML += (message + '<br>');
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