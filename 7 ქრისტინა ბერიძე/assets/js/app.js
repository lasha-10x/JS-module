const API_KEY = "1e62d31a821f07466bc27f0a3fbe41c6";
const BASE_URL_CURRENT_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const OWM_ICON_URL = "http://openweathermap.org/img/wn/";

const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const dateElement = document.getElementById("date");
const weatherIconElement = document.getElementById("weather-icon");
const tempValueElement = document.getElementById("temp-value");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const forecastCardsContainer = document.querySelector(".forecast-cards");

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
}

async function getWeatherData(city) {
    try {
        const currentWeatherResponse = await fetch(`${BASE_URL_CURRENT_WEATHER}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!currentWeatherResponse.ok) {
            if (currentWeatherResponse.status === 404) {
                throw new Error("ქალაქი ვერ მოიძებნა. გთხოვთ, შეამოწმოთ სახელის სისწორე.");
            } else if (currentWeatherResponse.status === 401) {
                throw new Error("API გასაღები არასწორია ან არასაკმარისი ნებართვებია. გთხოვთ, შეამოწმოთ თქვენი API Key.");
            } else {
                throw new Error(`HTTP შეცდომა! სტატუსი: ${currentWeatherResponse.status}`);
            }
        }
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(`${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!forecastResponse.ok) {
             if (forecastResponse.status === 404) {
                throw new Error("პროგნოზის მონაცემები ვერ მოიძებნა ამ ქალაქისთვის.");
            } else if (forecastResponse.status === 401) {
                throw new Error("API გასაღები არასწორია ან არასაკმარისი ნებართვებია. გთხოვთ, შეამოწმოთ თქვენი API Key.");
            } else {
                throw new Error(`HTTP შეცდომა! სტატუსი: ${forecastResponse.status}`);
            }
        }
        const forecastData = await forecastResponse.json();

        return { current: currentWeatherData, forecast: forecastData };

    } catch (error) {
        console.error("ამინდის მონაცემების მოძიების შეცდომა:", error);
        alert(error.message || "ამინდის მონაცემების მოძიება ვერ მოხერხდა. სცადეთ მოგვიანებით.");
        return null;
    }
}

function updateUI(data) {
    if (!data || !data.current || !data.forecast) {
        console.warn("მონაცემები არასრულია UI-ის განახლებისთვის.");
        return;
    }

    const { current, forecast } = data;

    locationElement.textContent = current.name;
    dateElement.textContent = formatDate(current.dt);
    weatherIconElement.src = `${OWM_ICON_URL}${current.weather[0].icon}@2x.png`;
    weatherIconElement.alt = current.weather[0].description;
    tempValueElement.textContent = Math.round(current.main.temp);
    descriptionElement.textContent = current.weather[0].description;
    humidityElement.textContent = `${current.main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;

    const weatherMain = current.weather[0].main.toLowerCase();
    const bodyElement = document.body;

    bodyElement.classList.remove('clear-sky', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado');

    if (weatherMain === 'clear' || weatherMain === 'sunny') {
        if (current.weather[0].icon.includes('d')) {
            bodyElement.classList.add('clear-sky');
        } else {
            bodyElement.classList.add('clear-sky');
        }
    } else if (weatherMain === 'clouds') {
        bodyElement.classList.add('clouds');
    } else if (weatherMain === 'rain') {
        bodyElement.classList.add('rain');
    } else if (weatherMain === 'drizzle') {
        bodyElement.classList.add('drizzle');
    } else if (weatherMain === 'thunderstorm') {
        bodyElement.classList.add('thunderstorm');
    } else if (weatherMain === 'snow') {
        bodyElement.classList.add('snow');
    } else if (
        weatherMain === 'mist' ||
        weatherMain === 'smoke' ||
        weatherMain === 'haze' ||
        weatherMain === 'dust' ||
        weatherMain === 'fog' ||
        weatherMain === 'sand' ||
        weatherMain === 'ash' ||
        weatherMain === 'squall' ||
        weatherMain === 'tornado'
    ) {
        bodyElement.classList.add('mist');
    }

    forecastCardsContainer.innerHTML = '';

    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of forecast.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toISOString().split('T')[0];

        if (!seenDates.has(dateString) && dailyForecasts.length < 5) {
            if (dailyForecasts.length === 0 || date.getHours() === 12) {
                dailyForecasts.push(item);
                seenDates.add(dateString);
            }
        }
        if (dailyForecasts.length === 5) break;
    }
    
    if (dailyForecasts.length < 5) {
        dailyForecasts.length = 0;
        seenDates.clear();
        for (const item of forecast.list) {
            const date = new Date(item.dt * 1000);
            const dateString = date.toISOString().split('T')[0];
            if (!seenDates.has(dateString) && dailyForecasts.length < 5) {
                dailyForecasts.push(item);
                seenDates.add(dateString);
            }
        }
    }

    dailyForecasts.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
            <p class="forecast-date">${formatDay(item.dt)}</p>
            <img src="${OWM_ICON_URL}${item.weather[0].icon}.png" alt="Weather icon">
            <p class="forecast-temp-min">Min: ${Math.round(item.main.temp_min)}°C</p>
            <p class="forecast-temp-max">Max: ${Math.round(item.main.temp_max)}°C</p>
        `;
        forecastCardsContainer.appendChild(card);
    });
}

cityInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            const data = await getWeatherData(city);
            if (data) {
                updateUI(data);
            }
        } else {
            alert("გთხოვთ, შეიყვანოთ ქალაქის სახელი!");
        }
    }
});

(async function init() {
    const initialCity = "Tbilisi";
    const data = await getWeatherData(initialCity);
    if (data) {
        updateUI(data);
    }
})();