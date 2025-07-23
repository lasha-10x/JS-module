// API KEY VARIABLE ==================================
const apiKey = "c002eabec3dffadff47e3a2e8c28fb4f";

// GLOBAL VARIABLES IMPORTED FROM index.html ==================================
const city = document.getElementById("city");
const COUNTRY_CODE = document.getElementById("country_code");
const temp = document.getElementById("temperature_degrees");
const WEATHER_INFO = document.getElementById("temperature_info");
const HUMIDITY_INDEX = document.getElementById("humidity_index");
const WIND_SPEED_INDEX = document.getElementById("wind_speed_index");
const PRESSURE_INDEX = document.getElementById("pressure_index");
const FEELS_LIKE_INDEX = document.getElementById("feels_like_index");
const VISIBILITY_INDEX = document.getElementById("visibility_index");
const SUNRISE_TIME = document.getElementById("sunrise_time");
const SUNSET_TIME = document.getElementById("sunset_time");
const search = document.getElementById("search");
const SEARCH_BTN = document.getElementById("seach_btn");
const FORECAST_CONTAINER =
  document.getElementsByClassName("forecast_container");
const DAY_WEATHER = document.querySelectorAll("#day_weather");
const MAX_TEMPERATURE = document.querySelectorAll("#day_time");
const MIN_TEMPERATURE = document.querySelectorAll("#night_time");

// BACKGROUND VARIABLES IMPORTED FROM style.css ==================================
const getVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name);

const SUNNY_DAY = getVar("--sunny_day");
const CLOUDY_DAY = getVar("--cloudy_day");
const RAINY_DAY = getVar("--rainy_day");
const SNOWY_DAY = getVar("--snowy_day");

const MOON_NIGHT = getVar("--moon_night");
const CLOUDY_NIGHT = getVar("--cloudy_night");
const RAINY_NIGHT = getVar("--rainy_night");
const SNOWY_NIGHT = getVar("--snowy_night");

// DAYS OBJECT FOR icon.js ==================================
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentWeatherData = null;