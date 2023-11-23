function fetchData(yearmonth) {
  fetch('https://script.google.com/macros/s/AKfycbwU9eCTCE3OiQjbkBhoTh8tTI1Lh0XFJtWh19360j6lKEyXcV2AvZBIW0t3TPV6dgo2/exec' + "?yearmonth=" + yearmonth)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // JSONデータを取得する例
  })
  .then(data => {
    generateTable(data.data, yearmonth); // サーバーから取得したデータを表示
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
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
        if(i == 0) {cell = document.createElement("th")}
        else {cell = document.createElement("td")};
        const cellText = document.createTextNode(element[property_names[i]]);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      tblBody.appendChild(row);

      tbl.setAttribute("border", "2");

    };

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);

    document.body.appendChild(tbl);


  }

  const query = "2023-11"

  fetchData(query);