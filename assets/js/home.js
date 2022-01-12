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

//display helper functions
const displayCurrent = (cityForecast, city) => {
  //title
  citySearchTerm.textContent = city;

  //name
  cityName.textContent = cityForecast.name;
  //date
  let today = new Date();
  const todaydate = today.toISOString().split("T")[0];
  cityDate.textContent = `(${todaydate})`;
  //icon
  cityWeatherIcon.textContent =
    "<a href=http://openweathermap.org/img/wn/" +
    cityForecast.weather[0].icon +
    "@2x.png></a>";
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
  console.log(dataArr);
  if (dataArr.length === 0) {
    futureContainerEl.textContent = "No data found.";
    return;
  }
  // for (let i = 0; i < dataArr.length; i++) {
  //   const sectionEl = document.createElement("div");

  //   const dateEl = document.createElement("span");
  //   var targetDate = new Date();
  //   targetDate.setDate(targetDate.getDate() + i + 1);
  //   const thedate = targetDate.toISOString().split("T")[0];
  //   dateEl.textContent = `${thedate} or ${dataArr.dt_txt}`;

  //   const iconEl = document.createElement("span");
  //   console.log(dataArr.weather);
  //   // iconEl.textContent = `${dataArr.weather[0].icon}`;
  //   const tempEl = document.createElement("span");
  //   tempEl.textContent = `Temperature in Kelvin: ${dataArr.main.temp}`;
  //   const windEl = document.createElement("span");
  //   windEl.textContent = `Wind speed: ${dataArr.wind.speed}`;
  //   const humidEl = document.createElement("span");
  //   humidEl.textContent = `Humidity: ${dataArr.main.humidity}`;

  //   sectionEl.appendChild(dateEl);
  //   sectionEl.appendChild(iconEl);
  //   sectionEl.appendChild(tempEl);
  //   sectionEl.appendChild(windEl);
  //   sectionEl.appendChild(humidEl);
  //   citiesForecastEl.appendChild(sectionEl);
  // }
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
          console.log(threehourData);
          let fiveDataArr = [];
          for (i = 0; i < threehourData.list.length; i++) {
            //take the weather at 3*3h (9 in the morning)
            if (i % (24 / 3) === 3) {
              fiveDataArr.push(threehourData.list[i]);
            }
          }
          console.log(fiveDataArr);
          displayFuture5(fiveDataArr);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};

// shows both current and future forecast
const formHandler = (event) => {
  event.preventDefault();

  const city = cityEl.value.trim();

  // getCurrent(city);
  get5(city);
  cityEl.textContent = "";
};

userFormEl.addEventListener("submit", formHandler);
