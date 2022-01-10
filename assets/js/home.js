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

          //get 5 days using the lat&lon info
          // var url =
          //   "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" +
          //   data.coord.lat +
          //   "&lon=" +
          //   data.coord.lon +
          //   "&exclude=current,minutely,hourly,alerts&appid=" +
          //   "c70713c6e0ec7c592b8da626a2b4edc5";
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

  let today = new Date();
  const todaydate = today.toISOString().split("T")[0];

  cityDate.textContent = `(${todaydate})`;
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
          cityUVI.textContent = data.current.uvi;
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => alert("Unable to connect"));
};

const displayFuture5 = (dataArr) => {
  console.log(dataArr);
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

userFormEl.addEventListener("submit", formHandler);
