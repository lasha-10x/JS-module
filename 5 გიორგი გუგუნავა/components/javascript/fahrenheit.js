// This file provides a utility function to convert temperature from Kelvin to Fahrenheit.
const KelvinToFahrenheit = (kelvin) => {
  const fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;

  return Math.round(fahrenheit) + "°F";
};
KelvinToFahrenheit();
console.log(KelvinToFahrenheit(300));
