const userFormEl = document.getElementById("user-form");
const cityEl = document.getElementById("city-name");
const citySearchTerm = document.getElementById("city-search-term");

const cityName = document.getElementById("name");
const cityDate = document.getElementById("date");
const cityWeatherIcon = document.getElementById("icon");
const cityTemp = document.getElementById("temp");
const cityHumidity = document.getElementById("humidity");
const cityWind = document.getElementById("wind");
const cityUVI = document.getElementById("uvi");

const citiesForecastEl = document.getElementById("cities-forecast");

const formHandler = (event) => {
  event.preventDefault();

  const city = cityEl.value.trim();
  getResults(city);
  cityEl.textContent = "";
};

const getResults = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    "c70713c6e0ec7c592b8da626a2b4edc5";
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          display(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};

const display = (cityForecast, city) => {
  citySearchTerm.textContent = city;

  cityName.textContent = cityForecast.name;
  cityDate.textContent = `${new Date()}`;
  cityWeatherIcon.textContent =
    "<a href=http://openweathermap.org/img/wn/" +
    cityForecast.weather[0].icon +
    "@2x.png></a>";
  cityTemp.textContent = cityForecast.main.temp;
  cityHumidity.textContent = cityForecast.main.humidity;
  cityWind.textContent = cityForecast.wind.speed;

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
          showUVI(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};
const showUVI = (data) => {
  cityUVI.textContent = data.current.uvi;
};
// for (let i = 0; i<cityForecast.length; i++) {

//     citiesForecastEl.appendChild(sectionEl)
// }
userFormEl.addEventListener("submit", formHandler);
