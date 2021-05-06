const TODAY = convertDateToIsoFormat(new Date());
const TABLE_DATA_INDEX_PREFIX = "table-data-index";

let BOOK_ENTRIES = Array();
let PAYMENT_SELECTOR = document.createElement("select");
let TABLE_BODY = document.getElementById("table-medicine-input").tBodies[0];
let YEAR_SELECTOR = document.getElementById("year-select");


getBookEntries();
setYearsSelector(YEAR_SELECTOR);
setPaymentSelector(PAYMENT_SELECTOR);


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
        let row = makeTableRow(entry);

        BOOK_ENTRIES.push(entry);
        TABLE_BODY.appendChild(row);
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
        let entries = BOOK_ENTRIES.filter(
          function (data) {
            let year = data.date.split("-")[0];
            return year == YEAR_SELECTOR.value;
          });
        resetTable(entries, TABLE_BODY);
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


function setPaymentSelector(select) {
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
    select.appendChild(fragment);
  };
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
  let input = PAYMENT_SELECTOR.cloneNode(true);
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


function makeTdDeletion() {
  let input = makeDeleteButton();

  let td = document.createElement("td");
  td.className = "table-data-deletion";
  td.appendChild(input);

  return td;
}


function makeDeleteButton() {
  let input = document.createElement("input");
  input.type = "image";
  input.src = "/static/images/trash.png";
  input.alt = "削除ボタン";
  input.className = "delete-button custom-button";
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
  let tds = [makeTdDate(entry.date), makeTdName(entry.name), makeTdAmount(entry.amount), makeTdDeletion()];
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
