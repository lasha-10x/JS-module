// This file controls the display of a loading spinner and the main weather content.
const loader = document.getElementsByClassName("sk-cube-grid");
const WEATHER_CONTENT = document.getElementsByClassName("city_container");

const showLoader = () => {
    if (loader) loader[0].style.display = "block";
    if (WEATHER_CONTENT) WEATHER_CONTENT[0].style.display = "none";
}

const hideLoader = () => {
    if (loader) loader[0].style.display = "none";
    if (WEATHER_CONTENT) WEATHER_CONTENT[0].style.display = "flex";
}

window.showLoader = showLoader;
window.hideLoader = hideLoader;