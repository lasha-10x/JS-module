// This file manages the visual effect of rain on the webpage, creating and animating raindrop elements.
const contentWrapper = document.getElementsByClassName("content_wrapper");
let raining;

const crateRainDrop = () => {
  const rain_drop = document.createElement("i");
  rain_drop.classList.add("fas");
  rain_drop.classList.add("fa-droplet");
  rain_drop.style.left = Math.random() * contentWrapper[0].clientWidth + "px";
  rain_drop.style.animationDuration = Math.random() * 1 + 1 + "s";
  rain_drop.style.opacity = Math.random();
  rain_drop.style.fontSize = Math.random() * 3 + 3 + "px";

  contentWrapper[0].appendChild(rain_drop);

  setTimeout(() => {
    rain_drop.remove();
  }, 5000);
};

const startRain = () => {
  if (!raining) {
    raining = setInterval(crateRainDrop, 10);
  }
};

const stopRaining = () => {
  clearInterval(raining);
  raining = null;
};
