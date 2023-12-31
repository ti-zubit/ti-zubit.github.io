async function fetchSurvivalDataAsync(url, yearmonth) {
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
      }
      else {
        const survivalCurveLink = "./survivarship_curve.html";
        generateTable(jsonData.data, yearmonth, survivalCurveLink); // サーバーから取得したデータを表示
      }
    })
    .catch(error => {
      console.error('There has been a problem in fetchSurvivalDataAsync:', error);
    });
}

async function fetchTemperatureDataAsync(place, year, month) {
  let url = "https://script.google.com/macros/s/AKfycbx_7ysrxM_lBAS1RfSn0pJ67-NsTEjN_X3kouEd1nQ0MBesQf7tDNXw2WGGl7QcgdHG/exec";
  let queryString = `?place=${place ? place : ""}&year=${year ? year : ""}&month=${month ? month : ""}`;
  url += queryString;
  await fetch(url)
    .then(responce => {
      if (!responce.ok) {
        throw new Error(responce.json().data.message ? responce.json().data.message : "Network response was not ok");
      }
      return responce.json();
    })
    .then(jsonData => {
      doPlot(jsonData.data, place, place);
    })
    .catch(error => {
      console.error('There has been a problem in fetchTemperatureDataAsync:', error);
    })
}

function generateTable(data, yearmonth, linkPage) {

  if (data.length < 1) {
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
      const cellText = document.createTextNode(element[property_names[i]]);
      if (i == 0) {
        cell = document.createElement("th");
        cell.appendChild(cellText);
      }
      else if (i == 1) {
        cell = document.createElement("td");
        let a = document.createElement("a");
        a.href = `${linkPage}?species=${element[property_names[i]]}`;
        a.classList.add("speciesOption");
        a.appendChild(cellText);
        cell.appendChild(a);
      }
      else {
        cell = document.createElement("td");
        cell.appendChild(cellText);
      };

      row.appendChild(cell);
    }

    tblBody.appendChild(row);

  };

  tbl.setAttribute("border", "2");

  tbl.appendChild(tblHead);
  tbl.appendChild(tblBody);

  document.getElementById("survialTable").appendChild(tbl);
  document.getElementById("survialTableMsg").textContent = "";

  // スタイルを適用する関数
  function addEventListener() {
    let elements = document.getElementsByClassName("speciesOption");
    for (elm of elements) {
      elm.style.color = "inherit";
      elm.addEventListener('mouseover', () => {
        elm.style.color = 'inherit';
      });
      elm.addEventListener('mouseout', () => {
        elm.style.color = 'inherit';
      });
      elm.addEventListener('click', () => {
        elm.style.color = 'inherit';
      });
    }
  }

  addEventListener();
}

function doPlot(data, label, id) {
  let labels = [];
  let values = [];
  for (var item in data) {
    labels.push(utc2Jst(Date.parse(data[item].time)));
    values.push(data[item].temp);
  }
  if (values.length < 1) {
    document.getElementById(id + "Msg").textContent = "No data.";
    return;
  }

  const ctx = document.getElementById(id);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
      }]
    },
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
  });

  document.getElementById(id + "Msg").textContent = "";
}

function setTitle(yearmonth) {
  document.getElementById("heading").textContent = "Analysis: " + yearmonth;
}

const queryString = window.location.search;
const queryParams = parseQueryString(queryString);

let year = queryParams.year;
let month = queryParams.month;
let yearmonth;
if (year && month) {
  yearmonth = `${year}-${month}`;
}
else {
  let now = new Date();
  year = now.getFullYear();
  month = now.getMonth() + 1;
  yearmonth = `${year}-${month}`;
}

const survivaDataUrl = 'https://script.google.com/macros/s/AKfycbxcGy5dG0TvLrzs2h1U96rG98J1bn5rXNSBC0tnJ8e40IfbVq-Cg1ANSYM6Yae2npVn/exec';
setTitle(yearmonth);
fetchSurvivalDataAsync(survivaDataUrl, yearmonth);
fetchTemperatureDataAsync("balcony", year, month);
fetchTemperatureDataAsync("indoor", year, month);

document.addEventListener("DOMContentLoaded", function () {
  let elements = document.getElementsByClassName("speciesOption");
  for (elm of elements) {
    elm.style.color = "inherit";
    elm.addEventListener('mouseover', () => {
      myLink.style.color = 'inherit';
    });
    elm.addEventListener('mouseout', () => {
      myLink.style.color = 'inherit';
    });
    elm.addEventListener('click', () => {
      myLink.style.color = 'inherit';
    });
  }
});