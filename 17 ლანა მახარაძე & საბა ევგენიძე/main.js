const API_KEY = '3b9a7f516d45030744c61efad1ca35a9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';


const cityInput = document.getElementById('city-input');
const currentTemp = document.getElementById('current-temp');
const currentCity = document.getElementById('current-city');
const currentCondition = document.getElementById('current-condition');
const weatherIcon = document.getElementById('weather-icon');
const humidityValue = document.getElementById('humidity-value');
const windSpeedValue = document.getElementById('wind-speed-value');
const pressureValue = document.getElementById('pressure-value');
const visibilityValue = document.getElementById('visibility-value');
const hourlyCardsContainer = document.getElementById('hourly-cards-container');
const dailyCardsContainer = document.getElementById('daily-cards-container');
const windArrow = document.getElementById('wind-arrow');
const windSpeedCompass = document.getElementById('wind-speed-compass');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');

function displayMessage(message, isError = true) {
  messageText.textContent = message;
  messageBox.style.display = 'block';
  messageBox.style.backgroundColor = isError ? '#dc2626' : '#16a34a';
  clearTimeout(displayMessage.timeoutId);
  displayMessage.timeoutId = setTimeout(() => {
    messageBox.style.display = 'none';
  }, 5000);
}

async function fetchWeather(endpoint, city) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ka`);
    if (!response.ok) {
      switch (response.status) {
        case 404:
          displayMessage(`ქალაქი არ მოიძებნა: "${city}". გადაამოწმეთ შეყვანილი ტექსი.`);
          break;
        case 401:
          displayMessage('არასწორი ან გამოტოვებული API გასაღები. გთხოვთ შეამოწმოთ API გასაღები.');
          break;
        default:
          displayMessage(`Error ${response.status}: ${response.statusText}`);
      }
      return null;
    }
    return await response.json();
  } catch (err) {
    displayMessage(`Network error: ${err.message}. შეამოწმე თქვენი ინტერნეტ კავშირი.`);
    return null;
  }
}

function updateCurrentWeatherUI(data) {
  currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
  currentCity.textContent = data.name;
  currentCondition.textContent = capitalize(data.weather[0].description);
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  humidityValue.textContent = `${data.main.humidity}%`;
  windSpeedValue.textContent = `${data.wind.speed.toFixed(1)} მ/წმ`;
  pressureValue.textContent = `${data.main.pressure} პოდი`;
  visibilityValue.textContent = `${(data.visibility / 1000).toFixed(1)} კმ`;

  if (typeof data.wind.deg === 'number') {
    windArrow.style.transform = `rotate(${data.wind.deg}deg)`;
  }
  windSpeedCompass.textContent = data.wind.speed.toFixed(1);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createForecastCard({ time, icon, description, temp, dayName, monthDay }) {
  const card = document.createElement('div');
  card.classList.add('forecast-card');

  card.innerHTML = `
    ${time ? `<div class="time">${time}</div>` : ''}
    ${dayName ? `<div class="date">${dayName}</div>` : ''}
    ${monthDay ? `<div class="date">${monthDay}</div>` : ''}
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <div class="temp">${temp}°C</div>
  `;
  return card;
}

function populateHourlyForecast(forecastData) {
  hourlyCardsContainer.innerHTML = '';
  const now = Date.now();

  const nextFive = forecastData.list
    .filter(item => item.dt * 1000 > now)
    .slice(0, 8)
    .map(item => {
      const date = new Date(item.dt * 1000);
      return createForecastCard({
        time: date.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit', hour12: false }),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        temp: Math.round(item.main.temp),
      });
    });

  nextFive.forEach(card => hourlyCardsContainer.appendChild(card));
}

function populateDailyForecast(forecastData) {
  dailyCardsContainer.innerHTML = '';
  const todayStr = new Date().toDateString();
  const dailyMap = {};

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toDateString();
    if (dateStr === todayStr || dailyMap[dateStr]) return;
    if (date.getHours() >= 11 && date.getHours() <= 13) {
      dailyMap[dateStr] = item;
    }
  });

  Object.values(dailyMap).slice(0, 5).forEach(item => {
    const date = new Date(item.dt * 1000);
    dailyCardsContainer.appendChild(
      createForecastCard({
        dayName: date.toLocaleDateString('ka-GE', { weekday: 'short' }),
        monthDay: date.toLocaleDateString('ka-Ge', { month: '2-digit', day: '2-digit' }),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        temp: Math.round(item.main.temp),
      })
    );
  });
}

async function getWeatherData(city) {
  if (!API_KEY) {
    displayMessage('გთხოვ დაამატეთ თქვენი OpenWeatherMap API გასაღები.', true);
    return;
  }
  displayMessage('ამინდის მონაცემების მიღება...', false);

  const [currentData, forecastData] = await Promise.all([
    fetchWeather('weather', city),
    fetchWeather('forecast', city),
  ]);

  if (currentData) {
    updateCurrentWeatherUI(currentData);
  } else {
    resetCurrentWeatherUI();
  }

  if (forecastData) {
    populateHourlyForecast(forecastData);
    populateDailyForecast(forecastData);
  } else {
    hourlyCardsContainer.innerHTML = '';
    dailyCardsContainer.innerHTML = '';
  }

  if (currentData || forecastData) {
    messageBox.style.display = 'none';
  }
}

function resetCurrentWeatherUI() {
  currentTemp.textContent = '--°C';
  currentCity.textContent = 'N/A';
  currentCondition.textContent = 'N/A';
  weatherIcon.src = '';
  weatherIcon.alt = 'ამინდის icon არ არსებობს';
  humidityValue.textContent = '--%';
  windSpeedValue.textContent = '-- m/s';
  pressureValue.textContent = '-- hPa';
  visibilityValue.textContent = '-- km';
  windArrow.style.transform = 'rotate(0deg)';
  windSpeedCompass.textContent = '--';
}

cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
      cityInput.value = '';
    } else {
      displayMessage('შეიყვანე ქალაქის სახელი');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  getWeatherData('Batumi');
});