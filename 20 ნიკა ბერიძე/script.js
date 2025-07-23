let isFahrenheit = false;
const apiKey = '829e4db07d583fbc19efa82060ebd74c';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

const loading = document.getElementById('loading');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const unitToggle = document.getElementById('unitToggle');
const themeSwitch = document.getElementById('themeSwitch');
const favoritesList = document.getElementById('favoritesList');

function showLoading(){ loading.classList.remove('hidden'); }
function hideLoading(){ loading.classList.add('hidden'); }

unitToggle.addEventListener('change', () => {
  isFahrenheit = unitToggle.checked;
  const city = document.getElementById('cityName').textContent;
  if (city && city !== 'City not found') {
    getWeather(city);
    getForecast(city);
  }
});

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    saveFavorite(city);
    getWeather(city);
    getForecast(city);
  } else {
    alert('Please enter a city name.');
  }
});

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeSwitch.checked);
});

function saveFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
  }
}

function renderFavorites() {
  favoritesList.innerHTML = '';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      getWeather(city);
      getForecast(city);
    });
    favoritesList.appendChild(li);
  });
}
renderFavorites();

function setBackgroundByWeather(id) {
  document.body.className = ''; // clear all styles
  const code = parseInt(id);
  if (code >= 200 && code < 300) document.body.classList.add('thunderstorm');
  else if (code >= 300 && code < 600) document.body.classList.add('rain');
  else if (code >= 600 && code < 700) document.body.classList.add('snow');
  else if (code >= 700 && code < 800) document.body.classList.add('wind');
  else if (code === 800) document.body.classList.add('sunny');
  else if (code > 800) document.body.classList.add('clouds');
}

async function getWeather(city) {
  const unit = isFahrenheit ? 'imperial' : 'metric';
  showLoading();
  try {
    const res = await fetch(`${baseUrl}weather?q=${city}&appid=${apiKey}&units=${unit}`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${data.main.temp}°${isFahrenheit ? 'F' : 'C'}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
    document.getElementById('sunset').textContent = `Sunset: ${sunset}`;
    
    // Set correct icon
    const icon = document.getElementById('weatherIcon');
    icon.className = `wi wi-owm-${data.weather[0].id}`;

    setBackgroundByWeather(data.weather[0].id);
  } catch (err) {
    document.getElementById('cityName').textContent = 'City not found';
  } finally {
    hideLoading();
  }
}

async function getForecast(city) {
  const unit = isFahrenheit ? 'imperial' : 'metric';
  showLoading();
  try {
    const res = await fetch(`${baseUrl}forecast?q=${city}&appid=${apiKey}&units=${unit}`);
    if (!res.ok) throw new Error('Forecast not available');
    const data = await res.json();
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    daily.forEach(day => {
      const date = new Date(day.dt_txt);
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <p><strong>${date.toDateString().slice(0, 10)}</strong></p>
        <i class="wi wi-owm-${day.weather[0].id} forecast-icon"></i>
        <p>${day.main.temp_min}° / ${day.main.temp_max}° ${isFahrenheit ? 'F' : 'C'}</p>
      `;
      forecastContainer.appendChild(card);
    });
  } catch (err) {
    document.getElementById('forecastContainer').innerHTML = '<p>Error loading forecast</p>';
  } finally {
    hideLoading();
  }
}
