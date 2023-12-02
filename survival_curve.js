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
        .then(() => {
            document.dispatchEvent(new Event("DOMContentLoaded"));
        })
        .catch(error => {
            console.error('There has been a problem in fetchSurvivalDataAsync:', error);
        });
}

// select要素を生成
function generateOptions(data, species) {
    data = JSON.parse(JSON.stringify(data));
    let select = document.createElement("select");
    select.multiple = "multiple";
    select.id = "dropdown";
    select.size = 10;

    let speciesIsSelected = false;
    data.forEach(element => {
        speciesIsSelected |= element.species === species;
    });
    for (let elm of data) {
        const cellText = document.createTextNode(elm.species);
        const option = document.createElement("option");
        option.appendChild(cellText);
        if (!speciesIsSelected || elm.species === species) {
            option.selected = true;
        }
        option.value = elm.species;

        select.appendChild(option);
    }
    document.getElementById("speciesOptions").appendChild(select);
    document.getElementById("display").hidden = false;
}

// 曲線を生成
function generateCurve(data) {
    data = JSON.parse(JSON.stringify(data));
    // 表示する種を選択
    let displayDataTemp = [];
    let selectedSpecies = document.getElementById("dropdown").selectedOptions;
    for (let selected of selectedSpecies) {
        data.forEach(element => {
            if (selected.value === element.species) {
                displayDataTemp.push(element);
            }
        });
    }

    // 一番古い日付と新しい日付からラベルを作成する
    let oldest = new Date();
    let latest = new Date("2000");
    displayDataTemp.forEach(element => {
        const spcOldest = new Date(element.monthList[0])
        const spcLatest = new Date(element.monthList[element.monthList.length - 1])
        oldest = spcOldest < oldest ? spcOldest : oldest;
        latest = spcLatest > latest ? spcLatest : latest;
    });
    let timeLabels = [oldest];
    while (timeLabels[timeLabels.length - 1] < latest) {
        const newDate = new Date(timeLabels[timeLabels.length - 1]);
        newDate.setMonth(newDate.getMonth() + 1);
        timeLabels.push(newDate);
    }

    // データの長さをそろえる
    displayDataTemp.forEach(element => {
        // 前を埋める
        const spcOldest = new Date(element.monthList[0]);
        for (let time of timeLabels) {
            if (time.getFullYear() >= spcOldest.getFullYear() && time.getMonth() >= spcOldest.getMonth()) {
                break;
            }
            element.survivorNumList.unshift(null);
        }
        // 後ろを埋める
        const spcLatest = new Date(element.monthList[element.monthList.length - 1]);
        let reverseTimeLabels = timeLabels.slice().reverse();
        for (let time of reverseTimeLabels) {
            if (time.getFullYear() <= spcLatest.getFullYear() && time.getMonth() <= spcLatest.getMonth()) {
                break;
            }
            element.survivorNumList.push(null);
        }
    });

    // chart用のデータセットを生成
    let datasets = [];
    for (let spcData of displayDataTemp) {
        datasets.push(
            {
                label: spcData.species,
                data: spcData.survivorNumList
            });
    }

    let labels = [];
    timeLabels.forEach(time => {
        labels.push(`${time.getFullYear()}-${time.getMonth() + 1}`)
    });

    // 曲線を表示
    const ctx = document.getElementById("survialCurve");

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    min: 0
                }
            }
        }
    })

    document.getElementById("survialCurveMsg").textContent = "";
}

var DATA;
var myChart;
const survivalCurveDataUrl = "https://script.google.com/macros/s/AKfycbxcGy5dG0TvLrzs2h1U96rG98J1bn5rXNSBC0tnJ8e40IfbVq-Cg1ANSYM6Yae2npVn/exec";

const queryString = window.location.search;
const queryParams = parseQueryString(queryString);

//executeasync();

fetchSurvivalCurveDataAsync(survivalCurveDataUrl, queryParams.species ? queryParams.species : "");

document.addEventListener("DOMContentLoaded", function () {

    const display = document.getElementById("display");

    function handleDisplayButtonClick() {
        // 既存のチャートインスタンスを取得
        const existingChart = document.getElementById('survialCurve').getContext('2d');

        // 既存のチャートインスタンスを破棄
        if (window.myChart !== undefined) {
            window.myChart.destroy();
        }

        generateCurve(DATA);
    }

    display.addEventListener("click", handleDisplayButtonClick);
});