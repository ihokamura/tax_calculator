let BOOK_SUMMARY = Array();
let TABLE_BODY = document.getElementById("table-medicine-summary").tBodies[0];
let YEAR_SELECTOR = document.getElementById("year-select");


getBookSummary();
setYearsSelector(YEAR_SELECTOR);


document.addEventListener(
  "DOMContentLoaded",
  function () {
    YEAR_SELECTOR.addEventListener(
      "input",
      function () {
        let entries = BOOK_SUMMARY.filter(
          function (data) {
            return data.year == YEAR_SELECTOR.value;
          });
        resetTable(entries, TABLE_BODY);
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
