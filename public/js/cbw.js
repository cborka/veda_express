


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

function edit_table4(table_id) {
  let tbl = document.getElementById(table_id);


  let colwidths = [5, 15, 50, 50, 15, 20];
  let tablewidth = 0;
  for (let i = 0; i < colwidths.length; i++) {
    tablewidth += colwidths[i];
  }


  let ths = document.querySelectorAll('#'+table_id + ' th'); // колонки таблицы
  //alert('kolonok: ' + ths.length);
  //alert('Секций данных: ' + tbl.tBodies.length);
  //alert('Строк в первой секции данных: ' + tbl.tBodies[0].rows.length);
  //alert('kolonok: ' + tbl.tBodies[0].rows[0].cells.length);
  for (let i = 0; i < ths.length; i++) {
  //for (var i = 0; i < 4; i++) {
    ths[i].width = Math.floor((colwidths[i]*100)/tablewidth) + "%"; // Ширина колонок по массиву colwidths
  }

  //alert(tbl.rows);
  //alert(tbl?.rowIndex);
  //alert('Strok: ' + tbl.rows.length);
  //if (tbl) alert(tbl.raws.length);
  //else alert(tbl);
  let tds = document.querySelectorAll('td');
  let td_old_value = '';
  for (let i = 0; i < tds.length; i++) {
    tds[i].tabIndex = 0;

//    tds[i].addEventListener('click', function func2() {
//      this.focus();;
//    });      


    tds[i].addEventListener('dblclick', function func() {
      //exit;

      let input = document.createElement('input');
      input.value = this.innerHTML;
      td_old_value = this.innerHTML;
      this.innerHTML = '';
      this.appendChild(input);
      input.focus();
      
      var td = this;
      input.addEventListener('blur', function() {
        td.innerHTML = this.value;
        td.addEventListener('dblclick', func);
      });

      input.onkeyup = function(e) {
        switch (e.keyCode) {
          case 13:
            this.blur();
            break;
          case 38:  // Стрелка вверх
            this.value = 'Стрелка вверх';// + tbl.rowIndex;
            //if (y > 1)  tbl.rows[y-1].cells[x].focus();
            //else  this.value = 'Это первая строка';
            break;
          case 40:  // Стрелка вниз
            this.value = 'Стрелка вниз';
            //                if (y < rows-1)  tbl.rows[y+1].cells[x].focus();
            //                else           erro(y + '- это последняя строка');
            break;
          case 39:  // Стрелка вправо не обрабатывается и правильно
            //                if (x < cells-1)  tbl.rows[y-1].cells[x].focus();
            //                else        erro(x + '- это последняя ячейка в строке');
            break;
          case 27: // Escape
            this.value = td_old_value;
            //                ed.value = v;
            //                erro('Escape');
            break;

          default:
          // erro(f.keyCode);
        }




        //if (e.key === 'Enter') {          // "Завершение редактирования."
        //  this.blur();
//          td.innerHTML = this.value;
//          td.addEventListener('click', func);
        //} else if (e.key === 'Escape') {  // Отмена изменений
        //  this.value = td_old_value;
        //}

        td.addEventListener('dblclick', func);
        //input.focus();
      };
      
      this.removeEventListener('dblclick', func);
    });
  }

}



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