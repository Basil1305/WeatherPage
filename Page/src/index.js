import './css/reset.css';
import './css/styles.css';
import bgService from './js/bg-service';
import weatherServiceDay from './js/weather-sercvice';
import timeService from './js/time-service';
import './css/media.css';
import weatherServiceFiveDays from './js/weather-fiveDays-service';
import dateAnd from 'date-and-time';
import handlebars from './templates/fiveDaysItem.hbs';
const Days = document.querySelector('.data__day');
const input = document.querySelector('input');
const wall = document.querySelector('#wrapper-body');
const Month = document.querySelector('.month');
const Place = document.querySelector('.current-city-name');
const loader = document.querySelector('.loader');
const icon = document.querySelector('#weather-today-sky');
const todayCurrentTemperature = document.querySelector(
  '.today-current-temperature',
);
const todayMin = document.querySelector('#today-min');
const todayMax = document.querySelector('#today-max');
var SunCalc = require('suncalc');
const sunrise__time = document.querySelector('.sunrise__time');
const twilight__time = document.querySelector('.twilight__time');
const OneButton = document.querySelector('.one-day');
const FiveButton = document.querySelector('.five-days');
const Time = document.querySelector('.time');
const ulForInsert = document.querySelector('.FiveDaysWeaterList');

OneButton.addEventListener('click', oneDayShow);
FiveButton.addEventListener('click', fiveDaysShow);
input.addEventListener('blur', changeBg);
input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeBg();
  }
});
if (inter) {
  clearInterval(inter);
}
function changeBg() {
  if (input.value.length > 2) {
    showLoader();
    bgService.fetchImg(`${input.value}`).then(data => {
      wall.style.backgroundImage = `url(${data.hits[2].largeImageURL})`;
    });
    weatherServiceFiveDays.fetchWeather(`${input.value}`).then(data => {
      weatherServiceFiveDays.Obj = data;
      const weaTher = weatherServiceFiveDays.Obj;
      const nearly = weaTher.map(elem => {
        const dayNumber = +dateAnd.format(
          new Date(elem.dt * 1000 + timeService.setTimeZoneNumber),
          'DD',
          true,
        );
        const dayString = dateAnd.format(
          new Date(elem.dt * 1000 + timeService.setTimeZoneNumber),
          'dddd',
          true,
        );
        const month = dateAnd.format(
          new Date(elem.dt * 1000 + timeService.setTimeZoneNumber),
          'MMM',
          true,
        );

        const obj = {
          day: dayNumber,
          dayString: dayString,
          month: month,
          icon: elem.icon,
          temMin: Math.round(elem.min),
          temMax: Math.round(elem.max),
        };
        return obj;
      });

      let currDay = +dateAnd.format(
        new Date(weaTher[0].dt * 1000 + timeService.setTimeZoneNumber),
        'DD',
        true,
      );
      let day6 = [];
      const firstDAy = nearly.filter(el => el.day === currDay);
      const secondDAy = nearly.slice(firstDAy.length, firstDAy.length + 8);
      const thirdDAy = nearly.slice(firstDAy.length + 8, firstDAy.length + 16);
      const fourDAy = nearly.slice(firstDAy.length + 16, firstDAy.length + 24);
      const fiveDAy = nearly.slice(firstDAy.length + 24, firstDAy.length + 32);
      const sixDAy = nearly.slice(firstDAy.length + 32);

      const day1 = firstDAy[0];
      const day2 = secondDAy[0];
      const day3 = thirdDAy[0];
      const day4 = fourDAy[0];
      const day5 = fiveDAy[0];
      if (sixDAy.length !== 0) {
        day6 = sixDAy[0];
        day6.temMin = Math.round(Math.min(...sixDAy.map(el => el.temMin)));
        day6.temMax = Math.round(Math.max(...sixDAy.map(el => el.temMax)));
      }
      day1.temMin = Math.round(Math.min(...firstDAy.map(el => el.temMin)));
      day1.temMax = Math.round(Math.max(...firstDAy.map(el => el.temMax)));
      day2.temMin = Math.round(Math.min(...secondDAy.map(el => el.temMin)));
      day2.temMax = Math.round(Math.max(...secondDAy.map(el => el.temMax)));
      day3.temMin = Math.round(Math.min(...thirdDAy.map(el => el.temMin)));
      day3.temMax = Math.round(Math.max(...thirdDAy.map(el => el.temMax)));
      day4.temMin = Math.round(Math.min(...fourDAy.map(el => el.temMin)));
      day4.temMax = Math.round(Math.max(...fourDAy.map(el => el.temMax)));
      day5.temMin = Math.round(Math.min(...fiveDAy.map(el => el.temMin)));
      day5.temMax = Math.round(Math.max(...fiveDAy.map(el => el.temMax)));

      const objectFiveDays = [];
      firstDAy.length === 1
        ? objectFiveDays.push(day2, day3, day4, day5, day6)
        : objectFiveDays.push(day1, day2, day3, day4, day5);
      const readyFullFiveDays = Build(objectFiveDays);
      ulForInsert.innerHTML = '';
      ulForInsert.insertAdjacentHTML('beforeend', readyFullFiveDays);
    });

    timeService.fetchWeather(`${input.value}`).then(data => {
      timeService.setTimeZoneNumber = data.timezone / 3600;
    });

    weatherServiceDay.fetchWeather(`${input.value}`).then(data => {
      Place.textContent = data.name + ', ' + data.sys.country;
      document.querySelector('.FiveDaysSmall__city-tablet').textContent =
        data.name + ', ' + data.sys.country;
      const date = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const today = new Date();
      const month = today.getMonth(data.dt);
      Month.textContent = date[month];
      const days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
      const day = today.getDay(data.dt);
      const numeric = today.getDate(data.dt);
      Days.textContent = `${days[day]} ${numeric}`;
      let linkIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      icon.src = linkIcon;
      todayCurrentTemperature.textContent = Math.round(data.main.temp);
      todayMin.textContent = Math.round(data.main.temp_min);
      todayMax.textContent = Math.round(data.main.temp_max);

      let times = SunCalc.getTimes(new Date(), data.coord.lat, data.coord.lon);
      const sunriseHourPlusZone =
        times.sunrise.getUTCHours() + timeService.setTimeZoneNumber;
      const sunsetHourPlusZone =
        times.sunset.getUTCHours() + timeService.setTimeZoneNumber;

      if (sunsetHourPlusZone < 0) {
        let g =
          24 +
          timeService.setTimeZoneNumber -
          timeService.setTimeZoneNumber / 2;
        let floor = Math.floor(g);

        let twilightStr = floor + ':' + times.sunset.getUTCMinutes();
        twilight__time.textContent = twilightStr;
      } else {
        let twilightStr =
          Math.floor(sunsetHourPlusZone) + ':' + times.sunset.getUTCMinutes();
        twilight__time.textContent = twilightStr;
      }
      if (sunriseHourPlusZone > 24) {
        let g = Math.round(sunriseHourPlusZone - 24);
        let sunriseStr = g + ':' + times.sunrise.getUTCMinutes();
        sunrise__time.textContent = sunriseStr;
      } else {
        let sunriseStr =
          Math.round(sunriseHourPlusZone) + ':' + times.sunrise.getUTCMinutes();
        sunrise__time.textContent = sunriseStr;
      }

      const timerId = setTimeout(hideLoader, 2000);
    });
    function interId() {
      const date = new Date();
      const timez = timeService.setTimeZoneNumber;
      const currentDate = {
        hours: String(date.getUTCHours()).padStart(2, '0'),
        minutes: String(date.getMinutes()).padStart(2, '0'),
        seconds: String(date.getSeconds()).padStart(2, '0'),
      };
      const mainH = Number(currentDate.hours) + timez;
      if (mainH > 24) {
        const readyN = Math.round(mainH - 24);
        const contentCurrentDate = `${readyN}:${currentDate.minutes}:${currentDate.seconds}`;
        Time.textContent = contentCurrentDate;
      } else {
        const contentCurrentDate = `${Math.round(mainH)}:${
          currentDate.minutes
        }:${currentDate.seconds}`;
        Time.textContent = contentCurrentDate;
      }
    }

    // name();
    const inter = setInterval(interId, 1000);
  } else {
    wall.style.backgroundImage = 'url(../images/sky.jpg)';
  }
}

function oneDayShow() {
  document.querySelector('.weather-today-wrapper').style.display = 'flex';
  document.querySelector('.data').style.display = 'flex';
  document.querySelector('.quote').style.display = 'block';
  document.querySelector('.AllFiveDays').style.display = 'none';
  OneButton.classList.add('weather-button-active');
  FiveButton.classList.remove('weather-button-active');
  FiveButton.classList.add('weather-button-unactive');
  OneButton.classList.remove('weather-button-unactive');
}

function fiveDaysShow() {
  document.querySelector('.AllFiveDays').style.display = 'block';
  document.querySelector('.weather-today-wrapper').style.display = 'none';
  document.querySelector('.data').style.display = 'none';
  document.querySelector('.quote').style.display = 'none';

  FiveButton.classList.add('weather-button-active');
  OneButton.classList.remove('weather-button-active');
  OneButton.classList.add('weather-button-unactive');
  FiveButton.classList.remove('weather-button-unactive');
}

function hideLoader() {
  loader.style.display = 'none';
  wall.style.display = 'block';
}

function showLoader() {
  loader.style.display = 'block';
  wall.style.display = 'none';
}
function Build(items) {
  return handlebars(items);
}
