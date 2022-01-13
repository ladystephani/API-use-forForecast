const userFormEl = document.getElementById("user-form");
const cityEl = document.getElementById("user-entered-name");

//display
//title
const citySearchTerm = document.getElementById("city-search-term");
//current
const cityName = document.getElementById("name");
const cityDate = document.getElementById("date");
const cityWeatherIcon = document.getElementById("icon");
const cityTemp = document.getElementById("temp");
const cityHumidity = document.getElementById("humidity");
const cityWind = document.getElementById("wind");
const cityUVI = document.getElementById("uvi");
//future
const futureContainerEl = document.getElementById("future-container");

const storageContainerEl = document.getElementById("storageContainer");

//display helper functions
const displayCurrent = (cityForecast, city) => {
  //title
  citySearchTerm.textContent = city;

  let savedCitiesArr = localStorage.getItem("city");

  savedCitiesArr = JSON.parse(savedCitiesArr);
  if (savedCitiesArr !== city) {
    setLocalStorage(city);
  }

  //name
  cityName.textContent = cityForecast.name;

  //date
  let today = new Date();
  const todaydate = today.toISOString().split("T")[0];
  cityDate.textContent = `(${todaydate})`;

  //icon
  const oneIconEl = document.createElement("img");
  oneIconEl.src = `http://openweathermap.org/img/wn/${cityForecast.weather[0].icon}@2x.png`;

  cityWeatherIcon.appendChild(oneIconEl);

  //temp
  cityTemp.textContent = `
Temperature (K): ${cityForecast.main.temp}`;

  //humidity
  cityHumidity.textContent = `
Humidity: ${cityForecast.main.humidity}`;

  //wind.speed
  cityWind.textContent = `
  wind speed: ${cityForecast.wind.speed}`;

  //uvi
  const uviUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityForecast.coord.lat +
    "&lon=" +
    cityForecast.coord.lon +
    "&exclude=hourly,daily&appid=" +
    "c70713c6e0ec7c592b8da626a2b4edc5";
  fetch(uviUrl)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          cityUVI.textContent = `
UVI: ${data.current.uvi}`;
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};
const displayFuture5 = (dataArr) => {
  // console.log(dataArr);
  if (dataArr.length === 0) {
    futureContainerEl.textContent = "No data found.";
    return;
  }

  futureContainerEl.textContent = "";

  for (let i = 0; i < dataArr.length; i++) {
    const sectionEl = document.createElement("div");
    sectionEl.classList =
      "list-item flex-row justify-space-between align-center";

    //date
    const dateEl = document.createElement("span");
    //   var targetDate = new Date();
    //   targetDate.setDate(targetDate.getDate() + i + 1);
    //   const thedate = targetDate.toISOString().split("T")[0];
    //   dateEl.textContent = `${thedate} `;
    dateEl.classList = "col-12 col-md-12";
    dateEl.textContent = `Date: ${dataArr[i].dt_txt}`;
    sectionEl.appendChild(dateEl);

    //icon
    //debug notes
    //console.log(dataArr.weather);//was missing dataArr[i]... so couldn't console log
    //after multiple times of NG...first a tag (not required to add the href link), then img tag with src
    const iconEl = document.createElement("a");
    iconEl.classList = "col-12 col-md-12";
    // iconEl.textContent = `http://openweathermap.org/img/wn/${dataArr[i].weather[0].icon}@2x.png`;
    const imglinkEl = document.createElement("img");
    imglinkEl.src = `http://openweathermap.org/img/wn/${dataArr[i].weather[0].icon}@2x.png`;
    iconEl.appendChild(imglinkEl);
    sectionEl.appendChild(iconEl);

    //temp
    const tempEl = document.createElement("span");
    tempEl.classList = "col-12 col-md-12";
    tempEl.textContent = `Temperature in Kelvin: ${dataArr[i].main.temp}`;
    sectionEl.appendChild(tempEl);

    //wind
    const windEl = document.createElement("span");
    windEl.classList = "col-12 col-md-12";
    windEl.textContent = `Wind speed: ${dataArr[i].wind.speed}`;
    sectionEl.appendChild(windEl);

    //humidity
    const humidEl = document.createElement("span");
    humidEl.classList = "col-12 col-md-12";
    humidEl.textContent = `Humidity: ${dataArr[i].main.humidity}`;
    sectionEl.appendChild(humidEl);

    futureContainerEl.appendChild(sectionEl);
  }
};

//helper function - current
const getCurrent = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    "c70713c6e0ec7c592b8da626a2b4edc5";
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // console.log(data);
          displayCurrent(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};

//helper function - future
const get5 = function (city) {
  var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&cnt=40" +
    "&appid=" +
    "c70713c6e0ec7c592b8da626a2b4edc5";
  fetch(url)
    .then((res) => {
      if (res.ok) {
        res.json().then((threehourData) => {
          // console.log(threehourData);
          let fiveDataArr = [];
          for (i = 0; i < threehourData.list.length; i++) {
            //take the weather at 3*3h (9 in the morning)
            if (i % (24 / 3) === 3) {
              fiveDataArr.push(threehourData.list[i]);
            }
          }
          // console.log(fiveDataArr);
          displayFuture5(fiveDataArr);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};

const setLocalStorage = (city) => {
  localStorage.setItem("city", JSON.stringify(city));
};

const showLocalStoredCities = () => {
  let savedCitiesArr = localStorage.getItem("city");
  if (!savedCitiesArr) {
    return false;
  }
  savedCitiesArr = JSON.parse(savedCitiesArr);
  console.log(savedCitiesArr);

  for (let i = 0; i < savedCitiesArr.length; i++) {
    createStorageEl(savedCitiesArr[i]);
  }
};
const createStorageEl = (stored) => {
  const citySpanEl = document.createElement("li");
  citySpanEl.classList =
    "list-item flex-row justify-space-between align-center";
  citySpanEl.textContent = `${stored}`;
  storageContainerEl.appendChild(citySpanEl);
};

// shows both current and future forecast
const formHandler = (event) => {
  event.preventDefault();

  const city = cityEl.value.trim();

  getCurrent(city);
  get5(city);

  cityEl.textContent = "";
};
storageContainerEl.addEventListener("load", showLocalStoredCities());
userFormEl.addEventListener("submit", formHandler);
