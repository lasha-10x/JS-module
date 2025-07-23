// This file manages the dark mode functionality of the webpage, allowing users to toggle between light and dark themes.
const CHANGE_BUTTON = document.getElementById("handle_cont");
// const darkMode = localStorage.getItem("darkmode");

const pageModes = () => {
  const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  };

  const disableDarkMode = () => {
    document.body.classList.remove("darkmode");

    localStorage.setItem("darkmode", null);
  };

  if (localStorage.getItem("darkmode") === "active") {
    enableDarkMode();
  }
  const updateBg = () => {
    if (WEATHER_INFO) {
      const currentWeatherCondition = WEATHER_INFO.textContent;
      if (currentWeatherCondition) {
        updateBackground(currentWeatherCondition);
      }
    }
  };
  CHANGE_BUTTON.addEventListener("click", () => {
    const currentMode = localStorage.getItem("darkmode");
    currentMode !== "active" ?  enableDarkMode() : disableDarkMode();
      updateBg();
  });
};

pageModes();
