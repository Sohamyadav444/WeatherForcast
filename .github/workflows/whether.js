const apiKey = "b5f12b94c456f8c343dadb508f18ffe8";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Generate the API URL
const url = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city));
    if (!resp.ok) throw new Error("City not found or API request failed");

    const respData = await resp.json();
    addWeatherToPage(respData);
  } catch (error) {
    main.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

function addWeatherToPage(data) {
  const groupedData = groupForecastByDay(data.list);

  // Clear previous weather and append the new forecast
  main.innerHTML = "";
  groupedData.forEach((day) => {
    const weather = document.createElement("div");
    weather.classList.add("weather");
    weather.className += " col-md-4 col-12 col-lg-3 p-2 ";
    weather.innerHTML = `
    <div class=' personalCard rounded shadow-lg fw-bold  p-2'>
    <h5>${day.date}</h5>
    <h4>Min: ${day.minTemp}°C | Max: ${day.maxTemp}°C</h4>
    <h4>${day.weatherDescription}</h4>
    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" />
    </div>
    `;
    main.appendChild(weather);
  });
}

function groupForecastByDay(forecastList) {
  const days = {};

  forecastList.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    const temp = Ktoc(entry.main.temp);
    const minTemp = Ktoc(entry.main.temp_min);
    const maxTemp = Ktoc(entry.main.temp_max);
    const description = entry.weather[0].description;
    const icon = entry.weather[0].icon;

    if (!days[date]) {
      days[date] = {
        date: date,
        minTemp: minTemp,
        maxTemp: maxTemp,
        weatherDescription: description,
        icon: icon,
      };
    } else {
      days[date].minTemp = Math.min(days[date].minTemp, minTemp);
      days[date].maxTemp = Math.max(days[date].maxTemp, maxTemp);
    }
  });

  return Object.values(days); // Return the first 5 days
}

function Ktoc(K) {
  return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value.trim();

  if (city) {
    getWeatherByLocation(city);
  } else {
    main.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
  }
});
