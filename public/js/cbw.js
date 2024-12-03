


//
// Fetch на клиенте (frontend)

//import { create } from "hbs";

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
let td_current = null;
let row_count = 0;

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

    customize_table_row (trs[i]);

    // trs[i].id = i; // надо чтобы не совпадало у разных таблиц документа для этого можно сделать отдельный цикл по ВСЕМ строкам таблиц документа
    // trs[i].changed = false;
  }

  // Установка обработчиков для ячеек таблицы
  let tds = document.querySelectorAll('td'); // все ячейки всех таблиц документа, однако это слишком, надо переделать для конкретной таблицы
  //let tds = document.querySelectorAll('#'+table_id+' td'); // ячейки для конкретной таблицы
  for (let i = 0; i < tds.length; i++) {
    customize_table_cell(tds[i]);
    
    // tds[i].tabIndex = 0;
    // tds[i].addEventListener('dblclick', tdDblclick);
    // tds[i].addEventListener('focusout', onTdFocusout);
    // tds[i].addEventListener('focus', onTdFocus);
    // //tds[i].addEventListener('blur', onTdFocusout);      // вместо blur стоит focusout, потому что он всплывает (из дочернего input)
    // tds[i].onkeyup = tdOnkeyup;
  }
  tds[0].focus();
}

function create_row_id() {
  return row_count++;
}

function customize_table_row (r) {
  r.id = create_row_id(); // надо чтобы не совпадало у разных таблиц документа для этого можно сделать отдельный цикл по ВСЕМ строкам таблиц документа
  r.changed = false;
}

function customize_table_cell (c) {
  c.tabIndex = 0;
  c.addEventListener('dblclick', tdDblclick);
  c.addEventListener('focusout', onTdFocusout);
  c.addEventListener('focus', onTdFocus);
  //tds[i].addEventListener('blur', onTdFocusout);      // вместо blur стоит focusout, потому что он всплывает (из дочернего input)
  c.onkeyup = tdOnkeyup;
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

//
// При получении фокуса ячейкой таблицы
//
function onTdFocus(e) {
  //log('---> onTdFocus ' + e.target.parentNode?.id);
  //log('---> onTdFocus ' + this.parentNode?.id);       // e.target и this - одно и то же
  td_current = this;
  current_table = td_current.parentNode.parentNode.parentNode;
                       // ячейка.строка.секция.таблица
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
      //prevRowCell(this.parentNode).focus();
      break;
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      //nextRowCell(this.parentNode).focus();
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
      prevRowCell(this).focus();
      break;
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      nextRowCell(this).focus();
      break;
    case "Left":
    case "ArrowLeft": 
      leftCell(this).focus();
      break;
    case "Right": 
    case "ArrowRight": 
      rightCell(this).focus();
      break;
    case "Insert": 
      // спросить подтверждение
      //insert_row();
      break;
    case "Delete": 
      // спросить подтверждение
      //delete_row();
      break;
    default:
    // erro(e.key);
  }
};


//
// Возвращает ячейку таблицы на предыдущей строке
//
function prevRowCell(td) {
  let row_num = td.parentNode.sectionRowIndex;
  let cell_num = td.cellIndex;

  if (row_num > 0) row_num--;

  //td.innerHTML = row_num + " - " + cell_num;

  return td.parentNode.parentNode.rows[row_num].cells[cell_num];
}

//
// Возвращает ячейку таблицы на следующей строке
//
function nextRowCell(td) {
  let row_num = td.parentNode.sectionRowIndex;
  let cell_num = td.cellIndex;

  if (row_num <= (td.parentNode.parentNode.rows.length - 2)) row_num++;
  if (row_num == (td.parentNode.parentNode.rows.length - 1)) append_row();

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


//
// Добавить пустую строку в конец таблицы
//
function append_row() {
  let td;
  let td_num;
  let inserted_row = document.createElement('tr');

  if (current_table?.rows?.length > 0) {          //Если в таблице есть строки, то делаю пустые поля, такое же количество
    td_num = current_table?.rows[0]?.cells?.length
  }
  else {
    td_num = 1;                                   // Если таблица пуста, то делаю строку с одним полем
  }

  for(let i=0; i<td_num; i++) {
    td = document.createElement('td');            // Создаю поля для добавляемой строки таблицы
    td.innerHTML = i;                             // Теоретически здесь надо значения в зависимости от типа - нули или пустые строки
    inserted_row.append(td);
    customize_table_cell(td);
  }

  customize_table_row(inserted_row);

  try {
    before_insert(inserted_row);
  }
  catch (e) {
    alert (e.message);
    return;
  }  
  //row.cells[0].innerHTML = row.id; // Присваиваю первому полю ид строки, для отладки и просто так, в реале тут будет ноль чтобы СУБД присвоила очередной реальный ид            
 
  current_table.tBodies[0].append(inserted_row);
  inserted_row.cells[0].focus();

// node.append(...nodes or strings) – вставляет в node в конец,
}

//
// Вставка строки в таблицу перед текущей строкой
//
function insert_row() {
  log('insert_row');

  if (!td_current) {            // Если текущее поле таблицы null, то значит таблица пуста и поэтому добавляю пустую строку
    return append_row();
  }

  //let td_no = td_current.cellIndex;
  let current_row = td_current.parentNode;
  let inserted_row = current_row.cloneNode(true); // делаем копию текущей строки

  customize_table_row(inserted_row);              // настройка строки, присваивание обработчиков и т.д.

  for(let i = 0; i < inserted_row.cells.length; i++) {
    customize_table_cell(inserted_row.cells[i]);  // настройка полей строки, присваивание обработчиков и т.д.
  }

  // Отдельной функцией настройки строки для конкретной таблицы, 
  //    для каждой таблицы своя функция, в которой делается инициализация ключевых полей и так далее
  // А так же вставка строки в соответствующую таблицу БД
  // try
    try {
      before_insert(inserted_row);
    }
    catch (e) {
      alert (e.message);
      return;
    }
  
  // catch

  current_row.before(inserted_row);               // вставка подготовленной строки в таблицу html
  td_current.focus();
  // elem.cloneNode(deep) – клонирует элемент, если deep==true, то со всеми дочерними элементами.
  // node.before(...nodes or strings) – вставляет прямо перед node,
}

//
// Удаление текущей строки
//
function delete_row() {
  log('delete_row');
  let current_row = td_current.parentNode;
  let next_row_cell = nextRowCell(td_current);
 
  // Отдельной функцией 
  //    для каждой таблицы своя функция
  // Удаление строки из соответствующей таблицы БД
  //before_delete(current_row);

  try {
    before_delete(current_row);
  }
  catch (e) {
    alert (e.message);
    return;
  }

  // Пытаюсь установить фокус на следующую строку после удаления текущей
  if (next_row_cell == td_current) {              // если последняя строка
    next_row_cell = prevRowCell(td_current);      //   пытаюсь встать (установить фокус) на предыдущую строку
    if (next_row_cell == td_current) {            // если первая и последняя строка
      td_current = null; 
      next_row_cell = null;                       // обнуляю адрес текущей ячейки, строк в таблице не осталось
    } 
  }

  log('удаление ');
  current_row.remove();               // удаление строки из таблицы html
  next_row_cell?.focus();

  // node.remove() – удаляет node.
}

function before_delete(current_row) {
  //throw new Error("Can not delete!");
}

function before_insert(inserted_row) {
  // Присваиваю первому полю ид строки, для отладки и просто так, в реале тут будет ноль чтобы СУБД присвоила очередной реальный ид            
  inserted_row.cells[0].innerHTML = inserted_row.id; 
  //throw new Error("Can not insert!");
}

//
// лог для отладочных сообщений
//
function log(message) {
  let l = document.getElementById('log');
  //l.innerHTML = message +  '<br>\n' + l.innerHTML ;
  if (l)
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




// Методы для создания узлов:

// document.createElement(tag) – создаёт элемент с заданным тегом,
// document.createTextNode(value) – создаёт текстовый узел (редко используется),
// elem.cloneNode(deep) – клонирует элемент, если deep==true, то со всеми дочерними элементами.

// Вставка и удаление:

// node.append(...nodes or strings) – вставляет в node в конец,
// node.prepend(...nodes or strings) – вставляет в node в начало,
// node.before(...nodes or strings) – вставляет прямо перед node,
// node.after(...nodes or strings) – вставляет сразу после node,
// node.replaceWith(...nodes or strings) – заменяет node.
// node.remove() – удаляет node.

// Устаревшие методы:

// parent.appendChild(node)
// parent.insertBefore(node, nextSibling)
// parent.removeChild(node)
// parent.replaceChild(newElem, node)
// Все эти методы возвращают node.

// Если нужно вставить фрагмент HTML, то elem.insertAdjacentHTML(where, html) вставляет в зависимости от where:

// "beforebegin" – вставляет html прямо перед elem,
// "afterbegin" – вставляет html в elem в начало,
// "beforeend" – вставляет html в elem в конец,
// "afterend" – вставляет html сразу после elem.
// Также существуют похожие методы elem.insertAdjacentText и elem.insertAdjacentElement, они вставляют текстовые строки и элементы, но они редко используются.

// Чтобы добавить HTML на страницу до завершения её загрузки:

// document.write(html)
// После загрузки страницы такой вызов затирает документ. В основном встречается в старых скриптах.












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