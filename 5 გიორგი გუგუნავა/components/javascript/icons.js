// This file provides functions to determine and update weather icons based on weather conditions.
const updateWeatherIcon = (iconPath, targetElement) => {
  if (targetElement) {
    targetElement.src = iconPath;
  }
};
const getWeatherIcon = (weatherCondition) => {
  const condition = weatherCondition.toLowerCase();

  const iconMap = {
    clear: "./assets/icon/weather-icons-master/svg/wi-day-sunny.svg",
    clouds: "./assets/icon/weather-icons-master/svg/wi-cloudy.svg",
    rain: "./assets/icon/weather-icons-master/svg/wi-rain.svg",
    snow: "./assets/icon/weather-icons-master/svg/wi-snow.svg",
  };

  return iconMap[condition];
};
