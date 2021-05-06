let BOOK_SUMMARY;
let TABLE_BODY = document.getElementById("table-medicine-summary").tBodies[0];
let SERVER_URL = "http://localhost:5000/";
let YEAR_SELECTOR = document.getElementById("year-select");


getBookSummary();
getYearList();


document.addEventListener(
  "DOMContentLoaded",
  function () {
    YEAR_SELECTOR.addEventListener(
      "input",
      function () {
        let book = BOOK_SUMMARY.filter(
          function (data) {
            return data.year == YEAR_SELECTOR.value;
          });
        resetTable(book);
      },
      false
    );
  },
  false
);


function getBookSummary() {
  let request = new XMLHttpRequest();
  let url = SERVER_URL + "book-summary";
  request.open("GET", url, true);
  request.send();
  request.onload = function () {
    BOOK_SUMMARY = JSON.parse(request.responseText);
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


function makeTdName(name) {
  let td = document.createElement("td");
  td.className = "table-data-name";
  td.textContent = name;

  return td;

}


function makeTdAmount(amount) {
  let td = document.createElement("td");
  td.className = "table-data-amount";
  td.textContent = amount;

  return td;
}


function makeTableRow(entry) {
  let fragment = document.createDocumentFragment();
  let tds = [makeTdName(entry.name), makeTdAmount(entry.amount)];
  for (td of tds) {
    fragment.appendChild(td);
  };

  let tr = document.createElement("tr");
  tr.appendChild(fragment);

  return tr;
}
