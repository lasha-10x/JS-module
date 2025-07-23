// This file provides a utility function to convert temperature from Kelvin to Celsius.
const KelvinToCelsius = (kelvin) => {
  const celsius = kelvin - 273.15;

  return Math.round(celsius) + "°C";
};
KelvinToCelsius();
console.log(KelvinToCelsius(300));
