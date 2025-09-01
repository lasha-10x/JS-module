// WARNING: gamoyenebulia GPT zog rameshi

document.addEventListener("DOMContentLoaded", function () {

  const liveDate = document.getElementById("live-date");
  const liveTime = document.getElementById("live-time");

  function updateTime() {
    // update date and time
    const now = new Date();
    liveDate.innerText = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    liveTime.innerText = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  setInterval(updateTime, 1000); // update every second
  updateTime();

  const API_KEY = "02474d6e520bd97a7035ae71847dc175"; //  API key from OpenWeatherMap

  const inp = document.getElementById("city-input"); // city input
  const btn = document.getElementById("search-btn"); // search button
  const loader = document.getElementById("loader"); // loader element
  const content = document.getElementById("app-content"); // app main content
  const errMsg = document.getElementById("error-message"); // error element

  const nowTemp = document.getElementById("current-temp"); // temperature
  const nowCity = document.getElementById("current-city"); // city
  const nowDesc = document.getElementById("current-description"); // weather description
  const nowIcon = document.getElementById("current-weather-icon"); // icon
  const feels = document.getElementById("feels-like"); // feels like temp
  const hum = document.getElementById("humidity"); // humidity
  const wind = document.getElementById("wind-speed"); // wind speed
  const press = document.getElementById("pressure"); // pressure

  const forecastContainer = document.getElementById("forecast-container"); // forecast container

  // search button click
  btn.addEventListener("click", function () {
    const city = inp.value.trim();  
    if (city) loadWeather(city); 
  });
// search button click with ENTER
  inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const city = inp.value.trim(); 
      if (city) loadWeather(city); 
    }
  });

  function showLoader() {
    loader.classList.remove("hidden"); 
    content.style.opacity = "0.5"; 
  }

  function hideLoader() {
    loader.classList.add("hidden"); 
    content.style.opacity = "1"; 
  }

  function showError(msg) {
    errMsg.innerText = msg; 
    errMsg.classList.remove("hidden");
  }

  function hideError() {
    errMsg.classList.add("hidden");
  }

  function KtoC(k) {
    return (k - 273.15).toFixed(0); // Kelvin to Celsius
  }

  function loadWeather(city) {
    showLoader(); 
    hideError(); 

    // fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error("City not found"); 
        return res.json();
      })
      .then((data) => {
        // update current weather UI
        nowTemp.innerText = KtoC(data.main.temp) + "°C";
        nowCity.innerText = data.name + ", " + data.sys.country;
        nowDesc.innerText = data.weather[0].description
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        nowIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        nowIcon.alt = data.weather[0].description;
        feels.innerText = KtoC(data.main.feels_like) + "°C";
        hum.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed.toFixed(1) + " m/s";
        press.innerText = data.main.pressure + " hPa";

        // update background (fotoebi ajobebda)
        // WARNING: gamoyenebulia GPT

        let id = data.weather[0].id; // weather id
        let ic = data.weather[0].icon; // icon code
        let night = ic.includes("n"); // night check
        let bg = "bg-default"; // default
        if (id >= 200 && id < 300) bg = "bg-thunderstorm";
        else if (id >= 300 && id < 400) bg = "bg-drizzle";
        else if (id >= 500 && id < 600) bg = "bg-rain";
        else if (id >= 600 && id < 700) bg = "bg-snow";
        else if (id >= 700 && id < 800) bg = "bg-atmosphere";
        else if (id === 800) bg = night ? "bg-clear-night" : "bg-clear";
        else if (id > 800) bg = night ? "bg-clouds-night" : "bg-clouds";
        document.body.className = "text-white transition-background " + bg;

        return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
      })
      .then((res) => res.json())
      .then((fData) => {
        forecastContainer.innerHTML = "";
        const forecastList = fData.list;
        const dailyForecasts = {};
        forecastList.forEach((item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          });
          if (!dailyForecasts[date]) {
            const forecastForDay = forecastList.find(
              (f) =>
                new Date(f.dt * 1000).getDate() === new Date(item.dt * 1000).getDate() &&
                new Date(f.dt * 1000).getHours() >= 12
            );
            if (forecastForDay) {
              dailyForecasts[date] = forecastForDay;
            }
          }
        });
        const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
        delete dailyForecasts[today];
        Object.values(dailyForecasts)
          .slice(0, 4)
          .forEach((item) => {
            const day = new Date(item.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            });
            const temp = KtoC(item.main.temp);
            const icon = item.weather[0].icon;

            const forecastItem = document.createElement("div");
            forecastItem.className = "text-center p-2 rounded-lg bg-white/10";
            forecastItem.innerHTML = `
                            <p class="font-semibold">${day}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${item.weather[0].description}" class="mx-auto w-12 h-12">
                            <p class="font-medium">${temp}°C</p>
                        `;
            forecastContainer.appendChild(forecastItem);
          });
      })
      .catch((err) => {
        console.log(err);
        showError(err.message);
      })
      .finally(() => hideLoader());
  }

  loadWeather("Batumi"); // default 
});
