// This file manages the visual effect of snowing on the webpage, creating and animating snowflake elements.
let snowing;

const crateSnowFlake = () => {
  const snow_flake = document.createElement("i");
  snow_flake.classList.add("fas");
  snow_flake.classList.add("fa-snowflake");
  snow_flake.style.left = Math.random() * contentWrapper[0].clientWidth + "px";
  snow_flake.style.animationDuration = Math.random() * 5 + 4 + "s";
  snow_flake.style.opacity = Math.random();
  snow_flake.style.fontSize = Math.random() * 4 + 4 + "px";

  contentWrapper[0].appendChild(snow_flake);

  setTimeout(() => {
    snow_flake.remove();
  }, 10000);
};

const startSnow = () => {
  if (!snowing) {
    snowing = setInterval(crateSnowFlake, 50);
  }
};

const stopSnowing = () => {
  clearInterval(snowing);
  snowing = null;
};
