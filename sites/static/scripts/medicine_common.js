const SERVER_URL = "http://localhost:5000/";


function setYearsSelector(select) {
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
    select.appendChild(fragment);
  };
}


function resetTable(entries, table) {
  destroyTable(table);
  createTable(entries, table);
}


function createTable(entries, table) {
  let fragment = document.createDocumentFragment();
  for (entry of entries) {
    let row = makeTableRow(entry);
    fragment.appendChild(row);
  }
  table.appendChild(fragment);
}


function destroyTable(table) {
  while (table.childNodes.length > 0) {
    table.childNodes[table.childNodes.length - 1].remove();
  }
}
