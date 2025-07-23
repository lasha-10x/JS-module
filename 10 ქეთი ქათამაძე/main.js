const apiKey = "ba9bc6d611f2998aa1fa56af94929acd";
const defaultCity = "Batumi";
let currentUnit = "metric";
let lastCity = defaultCity;

// Loader
function showLoader() { 
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// fetch weather
async function fetchWeather(city) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  showLoader();

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    document.querySelector("h2").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    document.querySelector(".description").textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    document.querySelector(".weather-info img").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const localTime = getLocalTime(data.timezone);
    document.querySelector(".current-date").textContent = localTime.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
    document.querySelector(".current-time").textContent = localTime.toTimeString().slice(0, 5);

updateTimeBackground(data.weather[0].main);
updateBackground(data.timezone);

  } catch (error) {
    console.error(error);
    document.querySelector(".time").innerHTML = `<p>City not found</p>`;
  } finally {
    hideLoader();
  }
}

// Local Time (based on timezone)
function getLocalTime(timezoneOffsetInSeconds) {
  const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
  return new Date(nowUTC.getTime() + timezoneOffsetInSeconds * 1000);
}

// BG update by weather 
function updateTimeBackground(weatherMain) {
  const timeDiv = document.querySelector('.time');
  if (!timeDiv) return;

  const gradients = {
    sunny: "linear-gradient(to bottom, #e0f7fa, #80deea)",
    cloudy: "linear-gradient(rgb(174, 190, 200), rgb(120 135 144))"
  };

  const sunnyConditions = ["Clear", "Sunny"];
  const cloudyConditions = ["Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist", "Fog", "Haze"];

  if (sunnyConditions.includes(weatherMain)) {
    timeDiv.style.background = gradients.sunny;
  } else if (cloudyConditions.includes(weatherMain)) {
    timeDiv.style.background = gradients.cloudy;
  } else {
    timeDiv.style.background = gradients.sunny;
  }
}

// Day/Night BG
function updateBackground(timezoneOffset) {
  const currentWeather = document.querySelector('.current-weather');
  if (!currentWeather) return;

  const localTime = getLocalTime(timezoneOffset);
  const hour = localTime.getHours();

  if (hour >= 6 && hour < 20) {
    currentWeather.style.backgroundImage = "url('./media/day.jpg')";
    currentWeather.style.color = 'black';
  } else {
    currentWeather.style.backgroundImage = "url('./media/night.jpg')";
    currentWeather.style.color = 'white';
  }
}

// 5-day forecast
async function fetchForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;
  
  showLoader();

  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const forecastContainer = document.querySelector(".forecast-cards");
    forecastContainer.innerHTML = "";

    const grouped = {};
    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    Object.entries(grouped).slice(0, 5).forEach(([date, entries]) => {
      const temps = entries.map(e => e.main.temp);
      const iconEntry = entries.find(e => e.dt_txt.includes("12:00:00")) || entries[0];
      const icon = iconEntry.weather[0].icon;
      const desc = iconEntry.weather[0].description;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <p>${new Date(date).toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric"
        })}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p>${Math.round(Math.min(...temps))}° / ${Math.round(Math.max(...temps))}°</p>`;
      forecastContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.querySelector(".forecast-cards").innerHTML = `<p>Forecast not available</p>`;
  } finally {
    hideLoader();
  }
}

// hourly forecast
async function fetchHourlyForecast(city) {
  const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;
  
  showLoader();

  try {
    const response = await fetch(hourlyUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const hourlyContainer = document.querySelector(".hourly-cards");
    hourlyContainer.innerHTML = "";

    const upcoming = data.list.filter(item => item.dt * 1000 > Date.now()).slice(0, 6);

    upcoming.forEach(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;
      const desc = item.weather[0].description;

      const card = document.createElement("div");
      card.className = "hour-card";
      card.innerHTML = `
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
        <p>${temp}°</p>
      `;
      hourlyContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.querySelector(".hourly-cards").innerHTML = `<p>Forecast not available</p>`;
  } finally {
    hideLoader();
  }
}

// Search
function searchCityWeather() {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    lastCity = city;
    fetchWeather(city);
    fetchForecast(city);
    fetchHourlyForecast(city);
  }
}

// Event Listeners
document.getElementById("search-btn").addEventListener("click", searchCityWeather);
document.getElementById("city-input").addEventListener("keypress", e => {
  if (e.key === "Enter") searchCityWeather();
});
document.getElementById("unit-switch").addEventListener("change", () => {
  currentUnit = document.getElementById("unit-switch").checked ? "imperial" : "metric";
  fetchWeather(lastCity);
  fetchForecast(lastCity);
  fetchHourlyForecast(lastCity);
});
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.querySelector(".time").classList.toggle("dark-mode");
  document.body.classList.toggle("dark-mode");
});


// Initial Load
fetchWeather(defaultCity);
fetchForecast(defaultCity);
fetchHourlyForecast(defaultCity);
