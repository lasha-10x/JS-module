const API_KEY = "b7c3ceee1d6e0350759daab0898f4b00";

const backgrounds = {
  "Clear-d": "clear.jpg",
  "Clear-n": "night.jpg",
  "Clouds-d": "clouds.jpg",
  "Clouds-n": "clouds-night.jpg",
  "Rain-d": "rain.jpg",
  "Rain-n": "rain.jpg",
  "Snow-d": "snowing-day.jpg",
  "Snow-n": "snowy-winter-night.jpg",
  "Thunderstorm-d": "thunderstorm.jpg",
  "Thunderstorm-n": "thunderstorm.jpg"
}


const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");
const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;

  spinner.classList.remove("hidden"); //for showing loading spinner

  try {
    const weatherData = await getWeatherData(city);
    getCurrentWeather(weatherData.current);
    getLongTermForecast(weatherData.forecast);
    console.log(weatherData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Could not find a city. Try another.");
  } finally {
    spinner.classList.add("hidden"); //for hiding loading spinner
  }
  console.log("Searching for:", city);
});

async function getWeatherData(city) {
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!currentRes.ok) throw new Error("City not found");
  const currentData = await currentRes.json();

  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!forecastRes.ok) throw new Error("Forecast fetch failed");
  const forecastData = await forecastRes.json();

  return {
    location: `${currentData.name}, ${currentData.sys.country}`,
    current: currentData,
    forecast: forecastData,
  };
}
// function for getting current weather info

function getCurrentWeather(current) {

  const condition = current.weather[0].main;
  const iconCode = current.weather[0].icon;
  const timeOfDay = iconCode.endsWith("n") ? "n" : "d";

  setBackground(condition, iconCode); //calling bacground function

  const iconKey = `${condition}-${timeOfDay}`;
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  if (!backgrounds[iconKey]) {
    console.warn(`Missing icon for ${iconKey}`);
  }
  const iconImg = document.querySelector("#weather-main-info img");
  iconImg.src = iconURL;
  iconImg.alt = current.weather[0].description;

  document.querySelector("#weather-main-info h1").textContent = `${Math.round(
    current.main.temp
  )}°C`;
  document.querySelector("#weather-main-info h2").textContent = current.name;
  const timezoneOffset = current.timezone; // seconds
  const localDate = new Date(Date.now() + timezoneOffset * 1000);

  // Format time
  const hours = localDate.getUTCHours().toString().padStart(2, '0');
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // Format date: "Sat, 19 Jul 2025"
  const dateStr = localDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Final string
  const fullDateTime = `${timeStr} - ${dateStr}`;

  document.querySelector("#weather-main-info span").textContent = fullDateTime;


  document.getElementById("temp-max").textContent = `${Math.round(
    current.main.temp_max
  )}°C`;
  document.getElementById("temp-min").textContent = `${Math.round(
    current.main.temp_min
  )}°C`;
  document.getElementById("humidity").textContent = `${current.main.humidity}%`;
  document.getElementById("cloudiness").textContent = `${current.clouds.all}%`;
  document.getElementById("wind").textContent = `${current.wind.speed} m/s`;
}

// function for getting long term weather forecast info

function getLongTermForecast(forecast) {
  const weekDaysContainer = document.querySelector(".week-days");
  weekDaysContainer.innerHTML = "";

  const dailyMap = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const hour = item.dt_txt.split(" ")[1];


    if (hour === "12:00:00") {
      dailyMap[date] = item;
    }
  });
  const dailyEntries = Object.entries(dailyMap);
  const maxDays = 7;

  dailyEntries.slice(0, maxDays).forEach(([date, data]) => {
    const condition = data.weather?.[0]?.main || "Clear";


    const iconCode = data.weather[0].icon;
    if (!iconCode) return;

    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const timeOfDay = iconCode.endsWith("n") ? "n" : "d";
    const iconKey = `${condition}-${timeOfDay}`;
    // const iconName = backgrounds[iconKey];

    const dayName = new Date(date).toLocaleString("en-US", {
      weekday: "short",
    });

    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);

    const card = document.createElement("div");
    card.innerHTML = `
    <h3>${dayName}</h3>
    <img src="${iconURL}" alt="${description}" />
    <p> ${temp}°C</p>
    <p>${description}</p> `;

    weekDaysContainer.appendChild(card);
  });
}

function formatWeekday(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", { weekday: "short" });
}

// function for setting background

function setBackground(condition, iconCode) {
  const timeOfDay = iconCode.endsWith("n") ? "n" : "d";
  const key = `${condition}-${timeOfDay}`;
  const bgImage = backgrounds[key] || "default.jpg";
  if (!backgrounds[key]) {
    console.warn(`No background found for ${key}. Using default.`);
  }

  const backgroundLayer = document.getElementById("background-layer");
  backgroundLayer.style.backgroundImage = `url('./assets/media/bg-images/${bgImage}')`;
}
// Preload images only once
Object.values(backgrounds).forEach((img) => {
  const preload = new Image();
  preload.src = `./assets/media/bg-images/${img}`;
});

window.addEventListener("DOMContentLoaded", async () => {
  const defaultCity = "Batumi";
  try {
    spinner.classList.remove("hidden");

    const weatherData = await getWeatherData(defaultCity);
    getCurrentWeather(weatherData.current);
    getLongTermForecast(weatherData.forecast);

    searchInput.value = defaultCity; // Optional: fills input with "Batumi"
  } catch (error) {
    console.error("Error loading default city:", error);
  } finally {
    spinner.classList.add("hidden");
  }
});
