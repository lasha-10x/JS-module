# Weather App with OpenWeather API

A modern, responsive weather application that displays current weather conditions, hourly forecasts, and 7-day forecasts using the OpenWeather API.

## Features

- **Current Weather**: Real-time weather data including temperature, feels-like temperature, wind speed, and cloud coverage
- **Search Functionality**: Search for weather in any city worldwide
- **Geolocation Support**: Automatically detects and displays weather for your current location
- **Hourly Forecast**: 6-hour forecast with weather icons and temperatures
- **7-Day Forecast**: Weekly weather outlook with high/low temperatures
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Dynamic Weather Icons**: Custom SVG icons that change based on weather conditions

## Setup Instructions

### 1. Get OpenWeather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Configure the Application

1. Open `script.js`
2. Find the line: `const API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key

```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 3. Run the Application

1. Start a local server (the app is already running on http://localhost:8000)
2. Open your browser and navigate to the server URL
3. The app will automatically load weather data for Madrid by default
4. If you allow location access, it will show weather for your current location

## Usage

### Search for Cities
- Type a city name in the search bar
- Press Enter to get weather data for that city
- The app will update all sections with new data

### Location Detection
- Allow location access when prompted
- The app will automatically fetch weather for your current coordinates
- If location access is denied, it defaults to Madrid

### Weather Data Displayed

- **Current Temperature**: Large display with weather icon
- **Real Feel**: How the temperature actually feels
- **Wind Speed**: Current wind speed in km/h
- **Cloud Coverage**: Percentage of cloud cover (used as rain chance approximation)
- **Visibility**: Current visibility distance
- **Hourly Forecast**: Next 6 hours with time, icon, and temperature
- **Weekly Forecast**: 7-day outlook with daily high/low temperatures

## API Endpoints Used

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`

## File Structure

```
weather_app/
├── index.html          # Main HTML structure
├── styles.css          # Compiled CSS styles
├── styles.scss         # SCSS source file
├── script.js           # JavaScript with API integration
└── README.md           # This file
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Geolocation API support
- Fetch API support

## Error Handling

- Invalid city names show an alert
- Network errors are logged to console
- Fallback to Madrid if geolocation fails
- Graceful degradation for missing data

## Customization

You can customize the app by:

1. **Changing Default City**: Modify the `getCurrentWeather('Madrid')` call in the initialization
2. **Adding More Weather Data**: Extend the API calls to include additional endpoints
3. **Styling**: Modify the SCSS file and recompile to CSS
4. **Weather Icons**: Update the icon creation functions in `script.js`

## Notes

- The free OpenWeather API has a limit of 1000 calls per day
- Weather data updates every 10 minutes on OpenWeather's servers
- Some weather metrics are approximated (UV Index uses visibility, rain chance uses cloud coverage)
- The app requires an internet connection to fetch weather data