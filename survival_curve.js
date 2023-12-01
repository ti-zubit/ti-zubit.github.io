async function fetchSurvivalCurveDataAsync(url, species) {
    url += "?f=SurvivalCurve";
    await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jsonData => {
        if (!jsonData.data) {
            console.log(jsonData.error);
        } 
        else {
            DATA = jsonData.data;
            generateOptions(DATA, species);
            generateCurve(DATA);
        }
    })
    .catch(error => {
      console.error('There has been a problem in fetchSurvivalDataAsync:', error);
    });
}

function generateOptions(data, species) {
    // select要素を生成
    let select = document.createElement("select");
    select.multiple = "multiple";

    let speciesIsSelected = false;
    data.forEach(element => {
        speciesIsSelected |= element.species === species;
    });
    for(let elm of data) {
        const cellText = document.createTextNode(elm.species);
        const option = document.createElement("option");
        option.appendChild(cellText);
        if(!speciesIsSelected || elm.species === species) {
            option.selected = true;
            option.classList.add("selected");
        }
        option.value = elm.species;

        select.appendChild(option);
    }
    document.getElementById("speciesOptions").appendChild(select);
    document.getElementById("display").hidden = false;
}

function generateCurve(data) {

}


var DATA;
const survivalCurveDataUrl = "https://script.google.com/macros/s/AKfycbxcGy5dG0TvLrzs2h1U96rG98J1bn5rXNSBC0tnJ8e40IfbVq-Cg1ANSYM6Yae2npVn/exec";

const queryString = window.location.search;
const queryParams = parseQueryString(queryString);

fetchSurvivalCurveDataAsync(survivalCurveDataUrl, queryParams.species ? queryParams.species : "");