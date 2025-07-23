'use strict';
import { WeatherApp } from "../service/weatherServices.js";
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();

    const { saveSettings, loadSettings, removeSettings, saveTheme, loadTheme, popularCities } = app;


    const menuBtn = document.querySelector('.header__icon-cover.menu');
    const menuBtnIcon = document.querySelector('.fa-solid.fa-ellipsis-vertical');
    const menu = document.querySelector('header .settings');
    const modal = document.querySelector('body .modal');
    const modalCancel = document.querySelector('body .modal .modal__cancel');


    const submenu = document.querySelector('.submenu');
    const darkTheme = document.querySelector('.submenu .dark');
    const lightTheme = document.querySelector('.submenu .light');

    const darkIcon = document.querySelector('.submenu .dark i');
    const lightIcon = document.querySelector('.submenu .light i');

    const body = document.body;

    const weatherSettings = document.querySelector('header .weather__settings');
    const weatherTheme = document.querySelector('header .weather__theme');

    ///////////
    const weatherCity = document.querySelector('.weather__city h2');
    const cityTemp = document.querySelector('.weather__forecast-temp h2');
    const feels = document.querySelector('.weather__feels-temp');
    const weatherSky = document.querySelector('.weather__sky');
    const weatherIcon = document.querySelector('.weather__status img');
    const weatherDate = document.querySelector('.weather__status time');


    const humidity = document.querySelector('.details__item-humidity span');
    const wind = document.querySelector('.details__item-wind span');
    const pressure = document.querySelector('.details__item-pressure span');

    const humidityStatusVal = document.querySelector('.details__item-humidity .status');
    const windStatusVal = document.querySelector('.details__item-wind .status');
    const pressureStatusVal = document.querySelector('.details__item-pressure .status');

    ///////////
    const weatherDays = document.querySelector('.weather__daily .weather__days');
    const weatherDailyItems = document.querySelector('.weather__daily .weather__daily-items');
    ///////////

    const weatherLoader = document.querySelector('.weather__loader');

    const modalInner = document.querySelector('.modal__inner');
    const modalPopular = document.querySelector('.modal__popular-inner');
    const modalHistory = document.querySelector('.modal__history .modal__history-cities');

    const trash = document.querySelector('.modal__trash-btn');
    const saveBtn = document.querySelector('.modal__save-box .modal__save');

    const celsius = document.querySelector('.modal__temperature .celsius');
    const fahrenheit = document.querySelector('.modal__temperature .fahrenheit');

    const celsiusInp = document.querySelector('.modal__temperature .celsius input');
    const fahrenheitInp = document.querySelector('.modal__temperature .fahrenheit input');

    const feelsRain = document.querySelector('.weather__feels-rain .daily-rain');
    const feelsRainChance = document.querySelector('.weather__feels-rain .rain-chance');

    const modalInput = document.querySelector('.modal__input input');


    const humidityDetails = document.querySelector('.weather__details-item.humidity .details__decore');
    const windDetails = document.querySelector('.weather__details-item.wind .details__decore');
    const pressureDetails = document.querySelector('.weather__details-item.pressure .details__decore');


    const turbineSpeed = document.querySelector('.weather__details-item.wind svg #wind__speed');
    const pressureSpeed = document.querySelector('.weather__details-item.pressure svg #presure__speed');
    const humiditySpeed = document.querySelector('.weather__details-item.humidity svg #humidity__speed');


    const loaderCover = document.querySelector('header .loader__cover');
    const loader = document.querySelector('header .loader');

    const errMsg = document.querySelector('header .err__message');
    const errMsgText = document.querySelector('header .err__message span');



    let city = '';
    let tempScale = 'C';

    function loading() {
        weatherLoader.classList.add('show');
    }


    function done() {
        weatherLoader.classList.add('done');
        setTimeout(() => {
            weatherLoader.classList.remove('show');
            weatherLoader.classList.remove('done');
        }, 1100);
    }

    function removeLoader() {
        body.classList.remove('lock');
        loaderCover.classList.add('hide');
        loader.classList.add('hide');
    }

    function addLoader() {
        body.classList.add('lock');
        loaderCover.classList.remove('hide');
        loader.classList.remove('hide');
    }

    function errMessage(err) {
        errMsg.classList.add('show');
        errMsgText.textContent = err;
        body.classList.add('lock');
    }

    menuBtn.addEventListener('click', (e) => {
        if (e.target === menuBtn || e.target === menuBtnIcon) {
            menu.classList.add('show');
        }
    });

    body.addEventListener('click', (e) => {
        const target = e.target;
        // body.style.setProperty('--decore-left', `${Math.min(window.innerWidth - 200, e.clientX - 100)}px`);
        // body.style.setProperty('--decore-top', `${Math.min(window.innerHeight - 200, e.clientY - 100)}px`);

        if (!menuBtn.contains(target) && !menu.contains(target)) {
            menu.classList.remove('show');
            submenu.classList.remove('show');
        }
    });


    weatherSettings.addEventListener('click', () => {
        body.classList.add('lock');
        modal.classList.add('reveal');
        menu.classList.remove('show');
    });


    weatherTheme.addEventListener('click', () => {
        submenu.classList.toggle('show');
    });


    submenu.addEventListener('click', (e) => {
        const target = e.target;
        if (darkTheme.contains(target)) {
            darkIcon.classList.add('fa-check');
            lightIcon.classList.remove('fa-check');
            menu.classList.remove('show');
            body.classList.add('dark');
            saveTheme('dark');

        }

        if (lightTheme.contains(target)) {
            lightIcon.classList.add('fa-check');
            darkIcon.classList.remove('fa-check');
            menu.classList.remove('show');
            body.classList.remove('dark');
            saveTheme('light');

        }
    });





    async function renderWeather(city = 'batumi', scale = 'C') {
        loading();
        addLoader();
        // app.getWeather().then(cleaned => {
        const cleaned = await app.getWeather(city);
        if (!cleaned) {
            console.log("data not found");
            errMessage('data not found.');
            return;
        }

        try {
            // console.log(cleaned);
            const { humidityStatus, windStatus, pressureStatus, turbineSpeedCalc, pressureSpeedCalc, humiditySpeedCalc } = app;
            const { tempC, tempF, feelsLikeC, feelsLikeF, condition, icon, humidityTmp, windTmp, pressureTmp } = cleaned.current;

            const scaleTemp = scale === 'C' ? tempC : tempF;
            const feelsLike = scale === 'C' ? feelsLikeC : feelsLikeF;
            let arrow = '';
            /////////////////////
            weatherCity.textContent = cleaned.location;
            cityTemp.textContent = Math.round(scaleTemp);
            feels.textContent = feelsLike.toFixed(1);
            weatherSky.textContent = condition;
            weatherIcon.src = icon.replace('//', 'https://');
            weatherDate.textContent = cleaned.date;
            weatherDate.setAttribute('datetime', cleaned.dateattr);


            humidity.textContent = `${humidityTmp} %`;
            wind.textContent = `${windTmp} km/h`;
            pressure.textContent = `${pressureTmp} hPa`;

            humidityDetails.style.setProperty('--humidity-width', `${humidityTmp}%`);
            windDetails.style.setProperty('--wind-width', `${(windTmp > 100 ? 100 : windTmp)}%`);
            pressureDetails.style.setProperty('--pressure-width', `${((pressureTmp - 980) / (1050 - 980)) * 100}%`);

            turbineSpeed.style.animationDuration = `${turbineSpeedCalc(windTmp)}s`;
            // turbineSpeed.style.animation = `rotate360 ${4}s linear infinite !important`;
            pressureSpeed.style.transform = `rotate(${pressureSpeedCalc(pressureTmp)}deg)`;
            //needle.style.transform = `rotate(${angle}deg)`;
            humiditySpeed.style.transform = `rotate(${humiditySpeedCalc(humidityTmp)}deg)`;



            humidityStatusVal.textContent = humidityStatus(humidityTmp);
            windStatusVal.textContent = windStatus(windTmp);
            pressureStatusVal.textContent = pressureStatus(pressureTmp);

            weatherDays.textContent = cleaned.forecast.length;

            feelsRain.textContent = cleaned.rain.rain ? 'Yes' : 'No';
            feelsRainChance.textContent = `(${cleaned.rain.chance}%)`;

            let today = 'Today';
            const weatherItems = cleaned.forecast.map((item, i) => {
                // console.log(item);
                if (i === 0) {
                    arrow = tempC <= item.maxTemp ? 'up' : 'down';
                    item.weekday = today;
                } else {
                    arrow = cleaned.forecast[i - 1].maxTemp < item.maxTemp ? 'up' : 'down';
                }




                // console.log(item.avgtemp);

                return `<div class="weather__daily-item">
                                <div class="weather__daily-day">${item.weekday}</div>
                                <div class="weather__daily-status">
                                    <img src="${item.icon.replace('//', 'https://')}" alt="status">
                                    <span>${item.condition}</span>
                                </div>
                                <div class="weather__daily-temp">
                                    <img class="weather__temp-direction" src="./img/arrow-${arrow}.svg"
                                        alt="temp-direction">
                                    <h4 class="weather__temp-degree">
                                        <span class="degree__temp">${Math.round(item.maxTemp)}</span>
                                        <span>°</span>
                                    </h4>
                                    <h4 class="weather__temp-feels">
                                        <span class="feels__temp">${Math.round(item.minTemp)}</span>
                                        <span>°</span>
                                    </h4>
                                </div>
                            </div>`;


            }).join('');

            weatherDailyItems.innerHTML = weatherItems;


        } catch (error) {
            errMessage('Error processing weather data.');
            console.error('Error processing weather data:', error);
        } finally {
            removeLoader();
            done();
        }
    };


    const theme = loadTheme();
    if (theme?.theme === 'dark') {
        body.classList.add('dark');
        darkIcon.classList.add('fa-check');
        lightIcon.classList.remove('fa-check');
    }
    if (theme?.theme === 'light') {
        body.classList.remove('dark');
        darkIcon.classList.remove('fa-check');
        lightIcon.classList.add('fa-check');
    }

    const settings = loadSettings();
    renderWeather(settings?.city, settings?.tempScale);

    if (settings && settings['city']) {
        const historySpan = document.createElement('span');
        historySpan.textContent = settings['city'];
        modalHistory.appendChild(historySpan);
        celsiusInp.checked = settings.tempScale === 'C';
        fahrenheitInp.checked = settings.tempScale === 'F';
    }

    // modalHistory

    modalInner.addEventListener('click', (e) => {
        const target = e.target;

        const span = e.target.closest('span');
        if ((modalHistory.contains(span) || modalPopular.contains(span)) && span) { // all elements
            city = span.textContent;
            //console.log('city');
            saveBtn.classList.add('show');
        }

        if (modalPopular.contains(span) && span) { // popular elements
            const elem = document.createElement('span');
            elem.textContent = span.textContent;
            // modalHistory.innerHTML = '';
            if (modalHistory.children.length === 1) {
                const last = modalHistory.lastElementChild;
                if (last) {
                    modalHistory.removeChild(last);
                }
            }
            modalHistory.prepend(elem);
        }

        if (trash.contains(target)) { // popular trash
            removeSettings();
            modalHistory.innerHTML = '';
            saveBtn.classList.remove('show');
            // modalHistoryCover.classList.add('hide');

        }

        if (celsius.contains(target)) { // celsius
            tempScale = "C";
            saveBtn.classList.add('show');
        }

        if (fahrenheit.contains(target)) { // fahrenheit
            tempScale = "F";
            saveBtn.classList.add('show');
        }


        if (saveBtn.contains(target)) { // save btn
            if (!city) city = settings.city;
            // city = settings.city;
            saveSettings(city, tempScale);
            renderWeather(city, tempScale);
            saveBtn.classList.remove('show');

            body.classList.remove('lock');
            modal.classList.remove('reveal');
            modalInput.value = '';
            popularCities(modalPopular);
        }

        if (modalCancel.contains(target)) { // cancel btn
            body.classList.remove('lock');
            modal.classList.remove('reveal');
            saveBtn.classList.remove('show');
            modalInput.value = '';
            popularCities(modalPopular);
            // modalHistory.innerHTML = '';
        };
    });

    // app.getLocation('Batumi')

    //modalPopular
    let debounceTimer;
    modalInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();

        if (value.length === 0) {
            popularCities(modalPopular);
            return;
        }
        if (value.length <= 2) return;


        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
            addLoader();
            try {
                const country = await app.getLocation(value);
                if (!country) {
                    console.log("data not found");
                    return;
                }

                if (country.length === 0) {
                    modalPopular.innerHTML = '<div class="modal__popular-notfound">Data not found</div>';
                    return;
                }

                const uniqueSpans = [...new Set(country)];
                const spans = uniqueSpans.map((item) => {
                    return `<span>${item}</span>`;
                }).join('');

                //console.log(country);
                modalPopular.innerHTML = spans;


            } catch (err) {
                console.error("error get data", err);
            } finally {
                removeLoader();
            }

        }, 500);
    });




});