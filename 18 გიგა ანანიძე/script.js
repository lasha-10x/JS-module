const API_KEY = '39afbec6f14140c987263742251907'; // RASIZAMT AM API KEY-T???
const BASE_URL = 'http://api.weatherapi.com/v1';

const searchInput = document.querySelector('.search-input');
const cityName = document.querySelector('.city-name');
const temperature = document.querySelector('.temperature');
const rainChance = document.querySelector('.rain-chance');
const weatherIcon = document.querySelector('.weather-icon svg');
const hourlyForecast = document.querySelector('.hourly-forecast');
const conditionValues = document.querySelectorAll('.condition-value');
const weeklyForecast = document.querySelector('.forecast-list');

function getWeatherIcon(conditionCode) {
    const code = parseInt(conditionCode);

    // Sunny
    if (code === 1000) return createSunIcon();

    // Partly cloudy
    if (code === 1003) return createPartlyCloudyIcon();

    // Cloudy/Overcast
    if (code === 1006 || code === 1009) return createCloudyIcon();

    // Mist/Fog
    if (code === 1030 || code === 1135 || code === 1147) return createMistyIcon();

    // Thunderstorms
    if (code >= 1087 && code <= 1087 || code >= 1273 && code <= 1282) return createStormyIcon();

    // Snow conditions
    if ((code >= 1066 && code <= 1066) || (code >= 1114 && code <= 1117) ||
        (code >= 1210 && code <= 1225) || code === 1237 ||
        (code >= 1255 && code <= 1264) || code === 1279 || code === 1282) {
        return createSnowyIcon();
    }

    // Rain conditions (default for most precipitation)
    return createRainyIcon();
}

document.addEventListener('DOMContentLoaded', () => {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') return;
        
        const city = searchInput.value.trim();
        if (!city) return;
        
        getCurrentWeather(city);
        searchInput.value = '';
    });

    if (!navigator.geolocation) {
        getCurrentWeather('Madrid');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getCurrentWeatherByCoords(latitude, longitude);
        },
        (error) => {
            console.log('Geolocation error:', error);
            getCurrentWeather('Madrid');
        }
    );
});

async function getCurrentWeather(city) {
    try {
        const weatherUrl = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;
        console.log('Making weather API request to:', weatherUrl);

        const weatherResponse = await fetch(weatherUrl);
        console.log('Weather response status:', weatherResponse.status);

        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            console.error('Weather API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        console.log('Weather data received:', weatherData);

        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateWeeklyForecast(weatherData);

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert(`Error: ${error.message}`);
    }
}

async function getCurrentWeatherByCoords(lat, lon) {
    try {
        const weatherUrl = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
        console.log('Making weather API request to:', weatherUrl);

        const weatherResponse = await fetch(weatherUrl);
        console.log('Weather response status:', weatherResponse.status);

        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            console.error('Weather API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        console.log('Weather data received:', weatherData);

        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateWeeklyForecast(weatherData);

    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        alert(`Error: ${error.message}`);
    }
}

function updateCurrentWeather(data) {
    cityName.textContent = data.location.name;
    temperature.textContent = `${Math.round(data.current.temp_c)}°`;

    // WeatherAPI.com provides chance of rain in forecast
    const todayForecast = data.forecast.forecastday[0].day;
    const rainChanceValue = todayForecast.daily_chance_of_rain || 0;
    rainChance.textContent = `Chance of rain: ${rainChanceValue}%`;

    const iconCode = data.current.condition.code.toString();
    weatherIcon.innerHTML = getWeatherIcon(iconCode);

    updateAirConditions(data);
}



function updateAirConditions(data) {
    const conditions = [
        `${Math.round(data.current.feelslike_c)}°`, // Feels like temperature
        `${data.current.wind_kph.toFixed(1)} km/h`, // Wind speed (already in km/h)
        `${data.current.cloud}%`, // Cloud coverage
        `${data.current.vis_km} km` // Visibility (already in km)
    ];

    conditionValues.forEach((element, index) => {
        if (conditions[index]) {
            element.textContent = conditions[index];
        }
    });
}



function updateHourlyForecast(data) {
    const hourlyData = data.forecast.forecastday[0].hour;
    const currentHour = new Date().getHours();

    // Get next 6 hours starting from current hour
    const nextHours = [];
    for (let i = 0; i < 6; i++) {
        const hourIndex = (currentHour + i) % 24;
        if (hourlyData[hourIndex]) {
            nextHours.push(hourlyData[hourIndex]);
        }
    }

    hourlyForecast.innerHTML = '';

    nextHours.forEach((item, index) => {
        const time = new Date(item.time);
        const hour = time.getHours();
        const timeString = `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        const iconCode = item.condition.code.toString();

        forecastItem.innerHTML = `
            <span class="time">${timeString}</span>
            <div class="forecast-icon">${getWeatherIcon(iconCode)}</div>
            <span class="temp">${Math.round(item.temp_c)}°</span>
        `;

        hourlyForecast.appendChild(forecastItem);
    });
}



function updateWeeklyForecast(data) {
    const dailyData = data.forecast.forecastday;

    weeklyForecast.innerHTML = '';

    dailyData.forEach((day, index) => {
        const maxTemp = Math.round(day.day.maxtemp_c);
        const minTemp = Math.round(day.day.mintemp_c);

        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' });
        const iconCode = day.day.condition.code.toString();
        const condition = day.day.condition.text;

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';

        forecastDay.innerHTML = `
            <span class="day">${dayName}</span>
            <div class="day-weather">
                <div class="day-icon">${getWeatherIcon(iconCode)}</div>
                <span class="day-condition">${condition}</span>
            </div>
            <span class="day-temp">${maxTemp}/${minTemp}</span>
        `;

        weeklyForecast.appendChild(forecastDay);
    });
}

function createSunIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="#FFA500"/>
            <g stroke="#FFA500" stroke-width="3" stroke-linecap="round">
                <line x1="50" y1="10" x2="50" y2="20"/>
                <line x1="50" y1="80" x2="50" y2="90"/>
                <line x1="10" y1="50" x2="20" y2="50"/>
                <line x1="80" y1="50" x2="90" y2="50"/>
                <line x1="25.86" y1="25.86" x2="32.93" y2="32.93"/>
                <line x1="67.07" y1="67.07" x2="74.14" y2="74.14"/>
                <line x1="25.86" y1="74.14" x2="32.93" y2="67.07"/>
                <line x1="67.07" y1="32.93" x2="74.14" y2="25.86"/>
            </g>
        </svg>
    `;
}

function createMoonIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <path d="M50 10 C 30 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 60 90, 70 85, 75 75 C 65 80, 55 75, 55 65 C 55 55, 65 45, 75 50 C 70 25, 60 10, 50 10 Z" fill="#E6E6FA"/>
        </svg>
    `;
}

function createCloudyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <ellipse cx="35" cy="45" rx="20" ry="15" fill="#87CEEB"/>
            <ellipse cx="55" cy="40" rx="25" ry="18" fill="#B0C4DE"/>
            <ellipse cx="45" cy="55" rx="30" ry="20" fill="#D3D3D3"/>
        </svg>
    `;
}

function createPartlyCloudyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="35" cy="35" r="15" fill="#FFA500"/>
            <ellipse cx="55" cy="50" rx="20" ry="15" fill="#87CEEB"/>
            <ellipse cx="65" cy="60" rx="25" ry="18" fill="#B0C4DE"/>
        </svg>
    `;
}

function createRainyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <ellipse cx="40" cy="35" rx="25" ry="18" fill="#696969"/>
            <ellipse cx="60" cy="40" rx="20" ry="15" fill="#808080"/>
            <line x1="35" y1="60" x2="32" y2="75" stroke="#4169E1" stroke-width="2"/>
            <line x1="45" y1="65" x2="42" y2="80" stroke="#4169E1" stroke-width="2"/>
            <line x1="55" y1="60" x2="52" y2="75" stroke="#4169E1" stroke-width="2"/>
            <line x1="65" y1="65" x2="62" y2="80" stroke="#4169E1" stroke-width="2"/>
        </svg>
    `;
}

function createStormyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <ellipse cx="40" cy="35" rx="25" ry="18" fill="#2F4F4F"/>
            <ellipse cx="60" cy="40" rx="20" ry="15" fill="#696969"/>
            <path d="M45 55 L 40 70 L 50 70 L 45 85 L 55 70 L 50 55 Z" fill="#FFD700"/>
        </svg>
    `;
}

function createSnowyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <ellipse cx="40" cy="35" rx="25" ry="18" fill="#B0C4DE"/>
            <ellipse cx="60" cy="40" rx="20" ry="15" fill="#D3D3D3"/>
            <circle cx="35" cy="65" r="3" fill="white"/>
            <circle cx="45" cy="70" r="3" fill="white"/>
            <circle cx="55" cy="65" r="3" fill="white"/>
            <circle cx="65" cy="70" r="3" fill="white"/>
            <circle cx="40" cy="75" r="3" fill="white"/>
            <circle cx="60" cy="75" r="3" fill="white"/>
        </svg>
    `;
}

function createMistyIcon() {
    return `
        <svg width="40" height="40" viewBox="0 0 100 100">
            <line x1="20" y1="40" x2="80" y2="40" stroke="#D3D3D3" stroke-width="4" opacity="0.7"/>
            <line x1="25" y1="50" x2="75" y2="50" stroke="#D3D3D3" stroke-width="4" opacity="0.5"/>
            <line x1="30" y1="60" x2="70" y2="60" stroke="#D3D3D3" stroke-width="4" opacity="0.7"/>
        </svg>
    `;
}
