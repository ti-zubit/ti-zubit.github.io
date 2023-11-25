async function fetchSurvivalDataAsync(yearmonth) {
  let url = 'https://script.google.com/macros/s/AKfycbw6tJxQqIj4bnLqisHO510iEQkPDbNkSE857X7reZld5PJ9w4_jsNZ2PE8pxNHM_OJr/exec';
  url += yearmonth ? "?yearmonth=" + yearmonth : ""; 
  await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // JSONデータを取得する例
    })
    .then(data => {
      if (!data.data) {
        console.log(data.error);
      } else {
        generateTable(data.data, yearmonth); // サーバーから取得したデータを表示
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

async function fetchTemperatureDataAsync(place, month, year){

}

function generateTable(data, yearmonth) {

  // <table>, <thead>, <tbody>作成
  const tbl = document.createElement("table");
  const tblHead = document.createElement("thead");
  const tblBody = document.createElement("tbody");

  // ヘッダーを作成
  const header = ["Sowing time", "Species", "Number of survivors", "Number of seeds sown"];
  const row = document.createElement("tr");
  header.forEach(element => {
    const cell = document.createElement("th");
    const cellText = document.createTextNode(element);
    cell.appendChild(cellText);
    row.appendChild(cell)
  });
  tblHead.appendChild(row);

  for (const element of data) {
    const row = document.createElement("tr");

    const property_names = ["sowMonth", "species", yearmonth, "seedNum"];

    for (let i = 0; i < property_names.length; i++) {
      let cell;
      if (i == 0) { cell = document.createElement("th") }
      else { cell = document.createElement("td") };
      const cellText = document.createTextNode(element[property_names[i]]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tblBody.appendChild(row);

    tbl.setAttribute("border", "2");

  };

  tbl.appendChild(tblHead);
  tbl.appendChild(tblBody);

  document.getElementById("survialTable").appendChild(tbl);

}

// クエリ文字列をオブジェクトに変換
function parseQueryString(queryString) {
  const params = {};
  const queryStringWithoutQuestionMark = queryString.slice(1); // 先頭の ? を削除

  queryStringWithoutQuestionMark.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[key] = decodeURIComponent(value?.replace(/\+/g, ' '));
  });

  return params;
}

function setTitle(yearmonth) {
  document.getElementById("heading").textContent = "Analysis: " + yearmonth;
}

const queryString = window.location.search;
const queryParams = parseQueryString(queryString);

let yearmonth = "";
if (queryParams.year && queryParams.month) {
  yearmonth = queryParams.year + "-" + queryParams.month;
}
fetchSurvivalDataAsync(yearmonth);
