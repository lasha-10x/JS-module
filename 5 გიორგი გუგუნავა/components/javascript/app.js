// This is the main application file, responsible for fetching weather data, rendering current weather and forecast information, and handling user interactions.
const fetchData = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 500) {
        throw new Error("SERVER_ERROR");
      }
      throw new Error("API_ERROR");
    }

    const data = await res.json();

    if (data.cod && data.cod !== "200") {
      throw new Error("API_ERROR");
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("NETWORK_ERROR");
    }
    throw error;
  }
};

const renderTodayWeather = (cities) => {
  const cityName = `${cities.city.name},`;
  const countryCode = cities.city.country;
  const weatherCondition = cities.list[0].weather[0].main;
  const weatherTemp = isFahrenheit
    ? KelvinToFahrenheit(cities.list[0].main.temp)
    : KelvinToCelsius(cities.list[0].main.temp);
  const feelsLikeTemp = isFahrenheit
    ? KelvinToFahrenheit(cities.list[0].main.feels_like)
    : KelvinToCelsius(cities.list[0].main.feels_like);
  const humidity = `${cities.list[0].main.humidity}%`;
  const windSpeed = `${cities.list[0].wind.speed}km/h`;
  const pressure = `${cities.list[0].main.pressure}hPa`;
  const visibility = calculateVisibility(cities.list[0].visibility);
  const sunriseTimestamp = new Date(cities.city.sunrise * 1000);
  const sunsetTimestamp = new Date(cities.city.sunset * 1000);
  const sunriseTime = `${sunriseTimestamp.getHours()}:${sunriseTimestamp.getMinutes()}`;
  const sunsetTime = `${sunsetTimestamp.getHours()}:${sunsetTimestamp.getMinutes()}`;
  const weatherIcon = getWeatherIcon(weatherCondition);
  const mainWeatherIcon = document.querySelector(".city_weather img");

  city.textContent = cityName;
  COUNTRY_CODE.textContent = countryCode;
  temp.textContent = weatherTemp;
  WEATHER_INFO.textContent = weatherCondition;
  HUMIDITY_INDEX.textContent = humidity;
  WIND_SPEED_INDEX.textContent = windSpeed;
  PRESSURE_INDEX.textContent = pressure;
  FEELS_LIKE_INDEX.textContent = feelsLikeTemp;
  VISIBILITY_INDEX.textContent = visibility;
  SUNRISE_TIME.textContent = sunriseTime;
  SUNSET_TIME.textContent = sunsetTime;

  updateWeatherIcon(weatherIcon, mainWeatherIcon);

  updateBackground(weatherCondition);
  const isRaining = () => {
    if (weatherCondition.toLowerCase() === "rain") {
      startRain();
    } else {
      stopRaining();
    }
  };
  const isSnowing = () => {
    if (weatherCondition.toLowerCase() === "snow") {
      startSnow();
    } else {
      stopSnowing();
    }
  };

  isRaining();
  isSnowing();
};

const renderForcast = (cities) => {
  const dailyForecasts = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const dayStart = i * 8;
    const dayEnd = dayStart + 8;
    const dayData = cities.list.slice(dayStart, dayEnd);

    if (dayData.length > 0) {
      const temperatures = dayData.map((item) => item.main.temp);
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);

      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dayName = days[forecastDate.getDay()];

      dailyForecasts.push({
        maxTemp,
        minTemp,
        weather: dayData[0].weather[0].main,
        dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayName,
      });
    }
  }

  console.log(dailyForecasts);

  dailyForecasts.forEach((dayForecast, index) => {
    if (MAX_TEMPERATURE[index] && MIN_TEMPERATURE[index]) {
      const maxTemperature = isFahrenheit
        ? KelvinToFahrenheit(dayForecast.maxTemp)
        : KelvinToCelsius(dayForecast.maxTemp);

      const minTemperature = isFahrenheit
        ? KelvinToFahrenheit(dayForecast.minTemp)
        : KelvinToCelsius(dayForecast.minTemp);

      MAX_TEMPERATURE[index].textContent = maxTemperature;
      MIN_TEMPERATURE[index].textContent = minTemperature;
      DAY_WEATHER[index].textContent = dayForecast.weather;

      const forecastIcon = getWeatherIcon(dayForecast.weather);
      const forecastWeatherIcon = document.querySelectorAll(".days img")[index];
      updateWeatherIcon(forecastIcon, forecastWeatherIcon);

      const dayNameElement = document.querySelectorAll(".days .day")[index];
      if (dayNameElement) {
        dayNameElement.textContent = dayForecast.dayName;
      }
    }
  });

  if (dailyForecasts.length > 0) {
    MAX_TEMPERATURE.textContent = isFahrenheit
      ? KelvinToFahrenheit(dailyForecasts[0].maxTemp)
      : KelvinToCelsius(dailyForecasts[0].maxTemp);
    MIN_TEMPERATURE.textContent = isFahrenheit
      ? KelvinToFahrenheit(dailyForecasts[0].minTemp)
      : KelvinToCelsius(dailyForecasts[0].minTemp);
    DAY_WEATHER.textContent = dailyForecasts[0].weather;
  }
};

const searchCity = async () => {
  const searchedCity = search.value;
  const errorMessage = document.getElementById("error_message");
  const serverErrorMessage = document.getElementById("server_error_message");
  const input = document.getElementById("search");

  input.classList.remove("error");
  errorMessage.classList.remove("error");
  serverErrorMessage.classList.remove("error");

  if (searchedCity) {
    try {
      if (window.showLoader) window.showLoader();
      const cities = await fetchData(searchedCity);
      currentWeatherData = cities;
      renderTodayWeather(cities);
      renderForcast(cities);
      temperatureMode(currentWeatherData);
      search.value = "";
    } catch (error) {
      input.classList.add("error");
      errorMessage.classList.add("error");
      if (
        error.message === "NETWORK_ERROR" ||
        error.message === "SERVER_ERROR"
      ) {
        serverErrorMessage.classList.add("server_error");
      }
      console.error("Error fetching weather data:", error);
    } finally {
      if (window.hideLoader) window.hideLoader();
    }
  }
};

search.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchCity();
  }
});

SEARCH_BTN.addEventListener("click", () => {
  searchCity();
});

const renderHtml = async () => {
  try {
    if (window.showLoader) window.showLoader();
    const cities = await fetchData("batumi");
    currentWeatherData = cities;
    renderTodayWeather(cities);
    renderForcast(cities);
    temperatureMode(currentWeatherData);
  } catch (error) {
    if (error.message === "NETWORK_ERROR" || error.message === "SERVER_ERROR") {
      const serverErrorMessage = document.getElementById(
        "server_error_message"
      );
      serverErrorMessage.classList.add("server_error");
    }
    console.error("Error loading initial weather data:", error);
  } finally {
    if (window.hideLoader) window.hideLoader();
  }
};

renderHtml();
console.log(fetchData("batumi"));
