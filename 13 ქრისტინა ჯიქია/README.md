# 🌦️ Weather Forecast App

A modern and responsive weather forecast website that allows users to check current weather and forecasts based on their location or a searched city. Built using HTML, SCSS, and JavaScript, it integrates with the OpenWeatherMap API for real-time weather data.

---

## 🎯 Features

- 📍 **Current Location Weather** – Uses the browser's Geolocation API.
- 🔎 **City Search** – Static for now, but ready for future live implementation.
- 🌓 **Dark Mode Toggle** – Switch between light and dark themes.
- 📆 **5-Day Forecast** – Includes temperature, icons, and date info.
- 🕐 **Hourly Forecast** – Temperature and wind speed for upcoming hours.
- 📱 **Responsive Design** – Looks great on desktop, tablet, and mobile.

---

## 🛠️ Technologies Used

- **HTML5** – Structure
- **SCSS (SASS)** – Styling, Variables, Mixins, and Dark Mode
- **JavaScript (ES6 Modules)** – Functionality and API interaction
- **OpenWeatherMap API** – Real-time weather data

---

## 🧠 How It Works

- On load, the app attempts to get the user’s location via the browser.
- If successful, it fetches weather data using OpenWeatherMap’s `One Call API`.
- Data is converted into a custom format and rendered into the UI.
- If the API fails or location access is denied, fallback static data (`data.js`) is displayed.

---

## 📁 Project Structure

## 🔑 API Key

This app uses the [OpenWeatherMap One Call API](https://openweathermap.org/api/one-call-api).  




