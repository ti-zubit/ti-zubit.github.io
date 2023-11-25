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
    .then(jsonData => {
      if (!jsonData.data) {
        console.log(jsonData.error);
        document.getElementById("survialTableMsg").textContent = "No data.";
      } else {
        generateTable(jsonData.data, yearmonth); // サーバーから取得したデータを表示
      }
    })
    .catch(error => {
      console.error('There has been a problem in fetchSurvivalDataAsync:', error);
    });
}

async function fetchTemperatureDataAsync(placeList, year, month) {
  try {
    let msg = document.getElementById("chartMsg").textContent;
    msg = "Loading...";

    let placeDataList = [];
    let url = "https://script.google.com/macros/s/AKfycbx_7ysrxM_lBAS1RfSn0pJ67-NsTEjN_X3kouEd1nQ0MBesQf7tDNXw2WGGl7QcgdHG/exec";

    for (let place of placeList) {
      let queryString = `?place=${place ? place : ""}&year=${year ? year : ""}&month=${month ? month : ""}`;
      url += queryString;
      const responce = await fetch(url);

      if (responce.status !== 200) {
        throw `response.status = ${response.status}, response.statusText = ${response.statusText}`;
      }

      const jsonData = await responce.json();

      if(jsonData.data.length > 0) {
        let labels = [];
        let values = [];
        for (var item in jsonData.data) {
          labels.push(utc2Jst(Date.parse(jsonData.data[item].time)));
          values.push(jsonData.data[item].temp);
        }
        placeDataList.push({placeName: place, labels, values});
      }
    }

    if(placeDataList < 1) {
      msg = "No Data.";
      return;
    }

    doPlot(placeDataList, "chart");

    msg = "";

  }
  catch (err) {
    console.log("error: " + err);
  }
}

function utc2Jst(utcDate) {
  var japanTime = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24時間制
  }).format(utcDate);

  return japanTime;
}

function generateTable(data, yearmonth) {

  if(data.length < 1) {
    
    return;
  }

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

  };

  tbl.setAttribute("border", "2");

  tbl.appendChild(tblHead);
  tbl.appendChild(tblBody);

  document.getElementById("survialTable").appendChild(tbl);
  document.getElementById("survialTableMsg").textContent = "";
}

function doPlot(placeDataList, id) {

  let labels = [];
  let datasets = [];
  for(let place of placeDataList) {
    labels = place.labels.length > labels.length ? place.labels : labels;
    datasets.push(getChartParam(place.placeName, place.values));
  }
  
  const ctx = document.getElementById(id);
  new Chart(ctx, {
    type: "line",
    labels: labels,
    datasets: datasets,
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        x:
        {
          scaleLabel: {
            display: true,
            labelString: "Date (JST)"
          },
        },
        y:
        {
          scaleLabel: {
            display: true,
            labelString: "Temperature (℃)",
          },
        }
      }
    }
  })
}

function getChartParam(label, values) {
  return {
        label: label,
        data: values,
    }
  };

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

const year = queryParams.year;
const month = queryParams.month;
let yearmonth = "";
if (year && month) {
  yearmonth = queryParams.year + "-" + queryParams.month;
  setTitle(yearmonth);
}
fetchSurvivalDataAsync(yearmonth);
const placeList = ["balcony", "indoor"];
fetchTemperatureDataAsync(placeList, year, month);
