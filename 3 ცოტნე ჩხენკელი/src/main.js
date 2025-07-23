import './style.css'

const WEATHER_EMOJI = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌦️', 56: '🌧️', 57: '🌧️', 61: '🌦️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️', 71: '🌨️', 73: '🌨️', 75: '❄️', 77: '❄️', 80: '🌦️', 81: '🌧️', 82: '🌧️', 85: '🌨️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️',
};
const WEATHER_DESC = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain', 67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
};

let tempUnit = 'C';

const toggleC = document.getElementById('toggle-c');
const toggleF = document.getElementById('toggle-f');
const themeToggle = document.getElementById('theme-toggle');
const weatherForm = document.getElementById('weather-form');

function setTempUnit(unit) {
  tempUnit = unit;
  toggleC.classList.toggle('active', unit === 'C');
  toggleF.classList.toggle('active', unit === 'F');
  toggleC.setAttribute('aria-pressed', unit === 'C');
  toggleF.setAttribute('aria-pressed', unit === 'F');
  if (window._lastWeather && window._lastCity) updateWeatherCard(window._lastWeather, window._lastCity);
  if (window._lastForecast) updateForecast(window._lastForecast);
}


toggleC.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    setTempUnit('C');
    e.preventDefault();
  }
});
toggleF.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    setTempUnit('F');
    e.preventDefault();
  }
});

toggleF.addEventListener('click', e => {
  setTempUnit('F');
  e.preventDefault();
});

toggleC.addEventListener('click', e => {
  setTempUnit('C');
  e.preventDefault();
});


themeToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    themeToggle.click();
    e.preventDefault();
  }
});

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function toF(c) { return c * 9 / 5 + 32; }

function showSpinner(show) {
  const overlay = document.getElementById('spinner-overlay');
  const weatherSection = document.getElementById('current-weather');
  const forecastSection = document.getElementById('forecast');
  if (show) {
    const parentRect = overlay.parentElement.getBoundingClientRect();
    const weatherRect = weatherSection.getBoundingClientRect();
    const forecastRect = forecastSection.getBoundingClientRect();
    const top = weatherRect.top - parentRect.top;
    const height = (forecastRect.bottom - parentRect.top) - top;
    overlay.style.top = top + 'px';
    overlay.style.height = height + 'px';
    overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }
  weatherForm.querySelectorAll('input,button').forEach(el => el.disabled = show);
}

function showWeatherSpinner(show) {
  const overlay = document.getElementById('spinner-overlay-weather');
  overlay.style.display = show ? 'flex' : 'none';
}
function showForecastSpinner(show) {
  const overlay = document.getElementById('spinner-overlay-forecast');
  overlay.style.display = show ? 'flex' : 'none';
  overlay.style.zIndex = 100;
}

async function getCoordsByCity(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.length) throw new Error('City not found');
  return { lat: data[0].lat, lon: data[0].lon, display_name: data[0].display_name };
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current_weather;
}

async function fetchForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  return data.daily;
}

function updateWeatherCard(weather, city) {
  window._lastWeather = weather;
  window._lastCity = city;
  const icon = WEATHER_EMOJI[weather.weathercode] || '❓';
  const desc = WEATHER_DESC[weather.weathercode] || 'Unknown';
  let temp = weather.temperature;
  let unit = '°C';
  if (tempUnit === 'F') {
    temp = toF(temp);
    unit = '°F';
  }
  document.querySelector('.weather-icon-placeholder').textContent = icon;
  document.querySelector('.weather-info .temp').textContent = `${Math.round(temp)}${unit}`;
  document.querySelector('.weather-info .desc').textContent = desc;
  document.querySelector('.weather-info .city').textContent = city;
}

function updateForecast(forecast) {
  window._lastForecast = forecast;
  const days = forecast.time.slice(0, 5);
  const maxTemps = forecast.temperature_2m_max.slice(0, 5);
  const minTemps = forecast.temperature_2m_min.slice(0, 5);
  const codes = forecast.weathercode.slice(0, 5);
  const forecastCards = document.querySelector('.forecast-cards');
  [...forecastCards.querySelectorAll('.forecast-card')].forEach(card => card.remove());
  days.forEach((date, i) => {
    const d = new Date(date);
    const day = d.toLocaleDateString(undefined, { weekday: 'short' });
    const icon = WEATHER_EMOJI[codes[i]] || '❓';
    let max = maxTemps[i], min = minTemps[i], unit = '°C';
    if (tempUnit === 'F') {
      max = toF(max); min = toF(min); unit = '°F';
    }
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="forecast-date">${day}</div>
      <div class="forecast-icon">${icon}</div>
      <div class="forecast-temp">${Math.round(max)}${unit} / ${Math.round(min)}${unit}</div>
    `;
    forecastCards.appendChild(card);
  });
}

function showWeatherError(msg) {
  document.querySelector('.weather-icon-placeholder').textContent = '❌';
  document.querySelector('.weather-info .temp').textContent = '--';
  document.querySelector('.weather-info .desc').textContent = msg;
  document.querySelector('.weather-info .city').textContent = '';
  document.querySelector('.forecast-cards').innerHTML = '';
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  let dark = false;
  if (saved === 'dark') dark = true;
  else if (saved === 'light') dark = false;
  else {
    dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  setTheme(dark);
  searchAndUpdate('Batumi');
});

weatherForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = weatherForm.querySelector('#city-input').value.trim();
  if (!city) return;
  searchAndUpdate(city);
});

async function searchAndUpdate(city) {
  document.getElementById('weather-form').querySelectorAll('input,button').forEach(el => el.disabled = true);
  setTimeout(async () => {
    try {
      showWeatherSpinner(true);
      const coords = await getCoordsByCity(city);
      const weather = await fetchWeather(coords.lat, coords.lon);
      updateWeatherCard(weather, city);
      showWeatherSpinner(false);
      showForecastSpinner(true); // Show forecast spinner before fetch
      const forecast = await fetchForecast(coords.lat, coords.lon);
      updateForecast(forecast);
      showForecastSpinner(false);
    } catch (err) {
      showWeatherSpinner(false);
      showForecastSpinner(false);
      showWeatherError('City not found');
    } finally {
      weatherForm.querySelectorAll('input,button').forEach(el => el.disabled = false);
    }
  }, 0);
}
