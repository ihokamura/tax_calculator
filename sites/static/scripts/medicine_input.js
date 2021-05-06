let BOOK_ENTRIES;
let PAYMENT_SELECT;
let TABLE_BODY = document.getElementById("table-medicine-input").tBodies[0];
let TABLE_DATA_INDEX_PREFIX = "table-data-index";
let TODAY = convertDateToIsoFormat(new Date());
let SERVER_URL = "http://localhost:5000/";
let YEAR_SELECTOR = document.getElementById("year-select");


getBookEntries();
getYearList();
getPaymentList();


document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.getElementById("add-button").addEventListener(
      "click",
      function () {
        let index = BOOK_ENTRIES.length;
        let date = TODAY;
        let name = "";
        let amount = 0;
        let entry = { index: index, date: date, name: name, amount: amount };
        BOOK_ENTRIES.push(entry);
        TABLE_BODY.appendChild(makeTableRow(entry));
      },
      false
    );
  },
  false
);


document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.getElementById("update-button").addEventListener(
      "click",
      function () {
        //let confirm = window.confirm("支払情報を更新しますか?");
        let confirm = true;
        if (confirm) {
          let request = new XMLHttpRequest();
          let url = SERVER_URL + "update";
          request.open("POST", url);
          request.setRequestHeader("Content-Type", "application/json");
          request.send(JSON.stringify(BOOK_ENTRIES));
        }
      },
      false
    );
  },
  false
);


document.addEventListener(
  "DOMContentLoaded",
  function () {
    YEAR_SELECTOR.addEventListener(
      "input",
      function () {
        let book = BOOK_ENTRIES.filter(
          function (data) {
            let year = data.date.split("-")[0];
            return year == YEAR_SELECTOR.value;
          });
        resetTable(book);
      },
      false
    );
  },
  false
);


function getBookEntries() {
  let request = new XMLHttpRequest();
  let url = SERVER_URL + "book";
  request.open("GET", url, true);
  request.send();
  request.onload = function () {
    BOOK_ENTRIES = JSON.parse(request.responseText);
  };
}


function getYearList() {
  let request = new XMLHttpRequest();
  let url = SERVER_URL + "years";
  request.open("get", url, true);
  request.send();
  request.onload = function () {
    let fragment = document.createDocumentFragment();
    let years = request.responseText.split("\n");
    for (year of years) {
      let option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      fragment.appendChild(option);
    }
    YEAR_SELECTOR.appendChild(fragment);
  };
}


function getPaymentList() {
  let request = new XMLHttpRequest();
  let url = SERVER_URL + "payments";
  request.open("get", url, true);
  request.send();
  request.onload = function () {
    let fragment = document.createDocumentFragment();
    let payments = request.responseText.split("\n");
    for (payment of payments) {
      let option = document.createElement("option");
      option.value = payment;
      option.textContent = payment;
      fragment.appendChild(option);
    }
    PAYMENT_SELECT = document.createElement("select");
    PAYMENT_SELECT.appendChild(fragment);
  };
}


function resetTable(book) {
  destroyTable();
  createTable(book);
}


function createTable(book) {
  let fragment = document.createDocumentFragment();
  for (entry of book) {
    let row = makeTableRow(entry);
    fragment.appendChild(row);
  }
  TABLE_BODY.appendChild(fragment);
}


function destroyTable() {
  // leave header and following text
  while (TABLE_BODY.childNodes.length > 2) {
    TABLE_BODY.childNodes[TABLE_BODY.childNodes.length - 1].remove();
  }
}


function makeTdDate(date) {
  let input = document.createElement("input");
  let [year, month, day] = date.split("-");
  input.type = "date";
  input.value = year + "-" + month + "-" + day;
  input.addEventListener(
    "input",
    function () {
      let index = getIndexOfEntry(input);
      BOOK_ENTRIES[index].date = input.value;
    },
    false
  );

  let td = document.createElement("td");
  td.className = "table-data-date";
  td.appendChild(input);

  return td;
}


function makeTdName(name) {
  let input = PAYMENT_SELECT.cloneNode(true);
  input.value = name;
  input.addEventListener(
    "input",
    function () {
      let index = getIndexOfEntry(input);
      BOOK_ENTRIES[index].name = input.value;
    },
    false
  );

  let td = document.createElement("td");
  td.className = "table-data-name";
  td.appendChild(input);

  return td;

}


function makeTdAmount(amount) {
  let input = document.createElement("input");
  input.type = "number";
  input.value = amount;
  input.addEventListener(
    "input",
    function () {
      let index = getIndexOfEntry(input);
      BOOK_ENTRIES[index].amount = input.value;
    },
    false
  );

  let td = document.createElement("td");
  td.className = "table-data-amount";
  td.appendChild(input);

  return td;
}


function makeTdOperations() {
  let button = makeDeleteButton();

  let td = document.createElement("td");
  td.className = "table-data-operations";
  td.appendChild(button);

  return td;
}


function makeDeleteButton() {
  let input = document.createElement("input");
  input.type = "image";
  input.src = "/static/images/trash.png";
  input.alt = "削除ボタン";
  input.className = "delete-button";
  input.addEventListener(
    "click",
    function () {
      //let confirm = window.confirm("支払情報を削除しますか?");
      let confirm = true;
      if (confirm) {
        let index = getIndexOfEntry(input);
        BOOK_ENTRIES.splice(index, 1);

        let tr = getRowNodeOfEntry(input);
        tr.remove();
      }
    },
    false
  );

  return input;
}


function makeTableRow(entry) {
  let fragment = document.createDocumentFragment();
  let tds = [makeTdDate(entry.date), makeTdName(entry.name), makeTdAmount(entry.amount), makeTdOperations()];
  for (td of tds) {
    fragment.appendChild(td);
  };

  let tr = document.createElement("tr");
  tr.id = TABLE_DATA_INDEX_PREFIX + entry.index;
  tr.appendChild(fragment);

  return tr;
}


function convertDateToIsoFormat(date) {
  let year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());

  return year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0");
}


function getRowNodeOfEntry(input) {
  return input.parentNode.parentNode;
}


function getIndexOfEntry(input) {
  return Number(getRowNodeOfEntry(input).id.replace(TABLE_DATA_INDEX_PREFIX, ""));
}
