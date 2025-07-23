// This file handles the temperature unit conversion feature, allowing users to switch between Celsius and Fahrenheit.
const CHANGE_TEMPERATURE = document.getElementById("temp_handle_cont");
// const fahrenheit = localStorage.getItem("tempterature");
let isFahrenheit = localStorage.getItem("tempterature") === "fahrenheit";

const temperatureMode = (currentWeatherData) => {
  const enableFahrenheit = () => {
    document.body.classList.add("fahrenheit");
    localStorage.setItem("tempterature", "fahrenheit");
    isFahrenheit = true
  };

  const disableFahrenheit = () => {
    document.body.classList.remove("fahrenheit");
    localStorage.setItem("tempterature", "celsius");
    isFahrenheit = false
  };

  if (isFahrenheit) {
    enableFahrenheit();
  }else{
    disableFahrenheit();
  }

  CHANGE_TEMPERATURE.addEventListener("click", () => {
    const currentMode = localStorage.getItem("tempterature");
    currentMode !== "fahrenheit" ? enableFahrenheit() : disableFahrenheit();
    if (currentWeatherData) {
      renderTodayWeather(currentWeatherData);
      renderForcast(currentWeatherData);
    }
  });
};

