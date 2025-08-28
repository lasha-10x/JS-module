const API_KEY = "0c421ff54e43e7c92fdb457ca57f1e42";

const WELCOME_BOX = document.getElementById("welcome");

const SEARCH_INPUT = document.getElementById("search-input");
const SEARCH_BUTTON = document.getElementById("search-button");
const SEARCH_ENGINE = document.getElementById("search-engine");
const HELPER_TEXT = document.getElementById("helper-text");
const PLACE = document.getElementById("place");
const WEATHER_VALUE = document.getElementById("weather-value");
const WEATHER_STATUS = document.getElementById("weather-status");
const WIND_SPEED = document.getElementById("wind-speed");
const HUMIDITY = document.getElementById("humidity");
const FAVORITE_BOX = document.getElementById("favorite-box");
const FAVORITE_BUTTON = document.getElementById("favorite-button");
const FAVORITES_CONTAINER = document.getElementById("favorites");
const FAVORITE_STAR = document.getElementById("favorite-star");
const WEEKLY_CONTAINER = document.getElementById("weekly-weather");
const BODY = document.querySelector("body");
const QUOTE = document.getElementById("quote");
const CHARACTER_IMAGE = document.getElementById("character-image");
const WEATHER_CONTENT = document.getElementById("weather-content");
const TRY_BUTTON = document.getElementById("try-button");

const EMOJIES = ["🌆", "🗼", "🏖️", "🎨", "🌉", "🕌", "🍷", "🍜", "🎡", "🚲"];

const FAVORITE_PLACES =
  JSON.parse(localStorage.getItem("favorite-places")) ?? [];
const CURRENT_PLACE = localStorage.getItem("current-place");

const isFavoritePlace = FAVORITE_PLACES.includes(CURRENT_PLACE);
if (isFavoritePlace) {
  FAVORITE_STAR.innerHTML = "★";
}

const getWetherData = async (place) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=9b1eafa8504d3df1a475ec2a4e57743f`;

  const res = await fetch(apiUrl);

  const weatherData = await res.json();

  if (weatherData.base) {
    clearErrorState();
    SEARCH_INPUT.value = "";
    renderContent(weatherData);
  } else {
    renderErrorState(weatherData.message);
  }

  renderWeeklyWeather();
};

SEARCH_BUTTON.addEventListener("click", async () => {
  const inputValue = SEARCH_INPUT.value;

  getWetherData(inputValue);
});

TRY_BUTTON.addEventListener("click",() => {
  getWetherData("batumi")
})

SEARCH_INPUT.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    SEARCH_BUTTON.click();
  }
});

const renderErrorState = (message) => {
  // render error states and messages around search input
  SEARCH_ENGINE.style.border = "solid 1px red";
  HELPER_TEXT.textContent = message;
};

const clearErrorState = () => {
  SEARCH_ENGINE.style.border = "none";
  HELPER_TEXT.textContent = "";
};

const renderContent = (weatherData) => {
  WEATHER_CONTENT.style.display = "flex";
  FAVORITE_BOX.style.display = "block";
  FAVORITES_CONTAINER.style.display = "flex";
  WELCOME_BOX.style.display = "none";
  const place = weatherData.name;
  const weatherInfo = weatherData.weather[0];
  const weatherObject = weatherContentConfig[weatherInfo.main];

  CHARACTER_IMAGE.setAttribute(
    "src",
    `../../assets/images/${weatherObject.character}`
  );

  PLACE.textContent = place;
  localStorage.setItem("current-place", place);
  const temp = weatherData.main.temp - 273.15;

  WEATHER_VALUE.textContent = temp.toFixed(0) + "°C";

  WEATHER_STATUS.textContent = weatherInfo.main;

  WIND_SPEED.textContent = weatherData.wind.speed;
  HUMIDITY.textContent = weatherData.main.humidity;
  BODY.style.background = weatherObject.backgroundColor;

  QUOTE.textContent = `"${weatherObject.quote}"`;
};

FAVORITE_BUTTON.addEventListener("click", () => {
  const currentPlace = localStorage.getItem("current-place");
  const favoriteCitiesString = localStorage.getItem("favorite-places");
  const favoriteCities = JSON.parse(favoriteCitiesString) ?? [];
  const isFavorite = favoriteCities?.includes(currentPlace);

  let newFavorites = [];

  if (isFavorite) {
    newFavorites = favoriteCities.filter((city) => city !== currentPlace);
    FAVORITE_STAR.innerHTML = "☆";
  } else {
    newFavorites = [...favoriteCities, currentPlace];
    FAVORITE_STAR.innerHTML = "★";
  }
  localStorage.setItem("favorite-places", JSON.stringify(newFavorites));
  renderFavorites(newFavorites);
});

const renderFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorite-places")) ?? [];
  // 1. ზემოთ შექმენი ცვლადი რომელიც წამოიღებს ფავორიტი ადგილების დივს (id="favorites")
  // 2. წამოღებულ ფავორიტ ადგილებზე დაატრიალე ციკლი და შექმენი ფავორიტი ადგილის ელემენტი (class="favorite-city")
  FAVORITES_CONTAINER.innerHTML = "";
  favorites.forEach((favoritePlace) => {
    const randomEmoji = EMOJIES[Math.floor(Math.random() * EMOJIES.length)];
    const favoriteContainer = document.createElement("div");
    favoriteContainer.className = "favorite-city";
    favoriteContainer.addEventListener("click", () => {
      getWetherData(favoritePlace);
    });
    favoriteContainer.innerHTML = `<p>${randomEmoji}</p>
          <p>${favoritePlace}</p>
          <img src="../assets/icons/location.png" alt="" />`;
    FAVORITES_CONTAINER.appendChild(favoriteContainer);
  });
  // 3. შექმენი ემოჯიების მასივი და რენდომულად დაამატე ციკლის ყოველ იტერაციაზე
};

renderFavorites();

const renderWeeklyWeather = async () => {
  const weeklyWeather = await getWeeklyWeatherData(CURRENT_PLACE);

  WEEKLY_CONTAINER.innerHTML = "";
  weeklyWeather.forEach((item) => {
    const weatherConfig = weatherContentConfig[item.weather[0].main];
    const weeklyCard = document.createElement("div");
    weeklyCard.className = "weekly-card";

    const currentTemp = item.main.temp - 273.15;
    const date = new Date(item.dt_txt);

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
    });

    weeklyCard.innerHTML = `<h4>${formatter.format(date)}</h4>
        <p class="emojy">${weatherConfig.icon}</p>
        <p class="celsius">${currentTemp.toFixed(0)}°C</p>
        <p class="weather-type">${item.weather[0].main}</p>`;

    WEEKLY_CONTAINER.appendChild(weeklyCard);
  });
};
