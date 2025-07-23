const apiKey = "329f0f349944cf5f59ccd05677f27437";

const cityNameEl = document.querySelector(".t-city-name");
const tempEl = document.querySelector(".t-temp");
const descEl = document.querySelector(".t-description");
const iconEl = document.querySelector(".t-weather-icon");
const searchBtn = document.getElementById("t-search-btn");
const cityInput = document.getElementById("t-city-input");
const forecastContainer = document.querySelector(".t-forecast-cards");

let unit = "metric";

// ამინდის წამოღება
async function fetchWeather(city) {
  try {
    showLoading();

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
    );
    if (!res.ok) throw new Error();

    const data = await res.json();
    const unitSymbol = unit === "metric" ? "°C" : "°F";

    cityNameEl.textContent = data.name;
    tempEl.textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    descEl.textContent = data.weather[0].description;
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    localStorage.setItem("lastCity", city);
  } catch (err) {
    alert("City not found.");
  }
}

// პროგნოზის წამოღება
async function fetchForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
    );
    if (!res.ok) throw new Error();

    const data = await res.json();
    const forecastList = data.list.filter(i => i.dt_txt.includes("12:00:00"));

    forecastContainer.innerHTML = "";

    forecastList.forEach(day => {
      const date = new Date(day.dt_txt);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const icon = day.weather[0].icon;
      const min = Math.round(day.main.temp_min);
      const max = Math.round(day.main.temp_max);

      forecastContainer.innerHTML += `
        <div class="t-forecast-card">
          <p>${weekday}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Icon" />
          <p>${max}° / ${min}°</p>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// კომბინირებული გამოძახება
async function fetchWeatherWithForecast(city) {
  await fetchWeather(city);
  await fetchForecast(city);
}

// ძიების დამუშავება
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherWithForecast(city);
});

// Loading ეფექტი
function showLoading() {
  tempEl.textContent = "...";
  descEl.textContent = "Loading...";
  iconEl.src = "";
}

// °C/°F გადართვა
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Switch °C/°F";
toggleBtn.style.marginTop = "10px";
toggleBtn.onclick = () => {
  unit = unit === "metric" ? "imperial" : "metric";
  fetchWeatherWithForecast(cityNameEl.textContent);
};
document.querySelector(".t-weather-display").appendChild(toggleBtn);

// Default ქალაქი
const lastCity = localStorage.getItem("lastCity") || "Tbilisi";
fetchWeatherWithForecast(lastCity);
