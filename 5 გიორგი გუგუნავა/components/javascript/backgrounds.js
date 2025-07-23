// This file dynamically updates the background image of the webpage based on the current weather condition and active display mode (dark/light).
const updateBackground = (weatherCondition) => {
  const body = document.body;
  const isDarkMode = body.classList.contains("darkmode");

  if (isDarkMode) {
    if (weatherCondition.toLowerCase() === "clear") {
      body.style.background = MOON_NIGHT;
    } else if (weatherCondition.toLowerCase() === "clouds") {
      body.style.background = CLOUDY_NIGHT;
    } else if (weatherCondition.toLowerCase() === "rain") {
      body.style.background = RAINY_NIGHT;
    } else if (weatherCondition.toLowerCase() === "snow") {
      body.style.background = SNOWY_NIGHT;
    }
  } else {
    if (weatherCondition.toLowerCase() === "clear") {
      body.style.background = SUNNY_DAY;
    } else if (weatherCondition.toLowerCase() === "clouds") {
      body.style.background = CLOUDY_DAY;
    } else if (weatherCondition.toLowerCase() === "rain") {
      body.style.background = RAINY_DAY;
    } else if (weatherCondition.toLowerCase() === "snow") {
      body.style.background = SNOWY_DAY;
    }
  }
};
