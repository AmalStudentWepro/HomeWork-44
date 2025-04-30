document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.open-meteo.com/v1/forecast?latitude=39.6542&longitude=66.9597&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m")
    .then(res => res.json())
    .then(data => showWeather(data));
});

function showWeather(data) {
  const app = document.createElement('div');
  app.className = 'app';

  const header = document.createElement('div');
  header.className = 'header';

  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.textContent = '☰';

  const locationInfo = document.createElement('div');
  locationInfo.className = 'location-info';

  const h2 = document.createElement('h2');
  h2.textContent = 'Samarkand';

  const pDate = document.createElement('p');
  pDate.textContent = new Date().toDateString();

  locationInfo.appendChild(h2);
  locationInfo.appendChild(pDate);

  const add = document.createElement('div');
  add.className = 'add';
  add.textContent = '＋';

  header.appendChild(menu);
  header.appendChild(locationInfo);
  header.appendChild(add);

  const mainWeather = document.createElement('div');
  mainWeather.className = 'main-weather';

  const weatherIcon = document.createElement('img');
  weatherIcon.className = 'weather-icon';
  weatherIcon.src = 'img/sunobloko.png';

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Clear';

  const temperature = document.createElement('h1');
  temperature.className = 'temperature';
  temperature.textContent = data.current.temperature_2m + '°';

  const minmax = document.createElement('div');
  minmax.className = 'minmax';

  const wind = document.createElement('span');
  wind.textContent = 'Wind: ' + data.current.wind_speed_10m + ' m/s';

  minmax.appendChild(wind);

  mainWeather.appendChild(weatherIcon);
  mainWeather.appendChild(description);
  mainWeather.appendChild(temperature);
  mainWeather.appendChild(minmax);

  const forecastHourly = document.createElement('div');
  forecastHourly.className = 'forecast-hourly';

  const btnPrev = document.createElement('button');
  btnPrev.textContent = '←';

  const btnNext = document.createElement('button');
  btnNext.textContent = '→';

  let hourIndex = 0;

  function renderHours() {
    forecastHourly.innerHTML = '';
    for (let i = hourIndex; i < hourIndex + 5 && i < data.hourly.time.length; i++) {
      const hour = document.createElement('div');
      hour.className = 'hour';

      const time = document.createElement('p');
      const hourTime = new Date(data.hourly.time[i]);
      time.textContent = hourTime.getHours().toString().padStart(2, '0') + ':00';

      const img = document.createElement('img');
      const tempVal = data.hourly.temperature_2m[i];
      if (tempVal > 30) {
        img.src = 'img/sun.png';
      } else if (tempVal >= 20) {
        img.src = 'img/sunobloko.png';
      } else {
        img.src = 'img/obloko.png';
      }

      const temp = document.createElement('p');
      temp.textContent = tempVal + '°';

      hour.appendChild(time);
      hour.appendChild(img);
      hour.appendChild(temp);
      forecastHourly.appendChild(hour);
    }
  }

  btnPrev.onclick = function () {
    if (hourIndex >= 5) {
      hourIndex -= 5;
      renderHours();
    }
  };

  btnNext.onclick = function () {
    if (hourIndex + 5 < data.hourly.time.length) {
      hourIndex += 5;
      renderHours();
    }
  };

  const btns = document.createElement('div');
  btns.appendChild(btnPrev);
  btns.appendChild(btnNext);

  renderHours();

  const temperatureValue = data.current.temperature_2m;
  temperature.textContent = temperatureValue + '°';

  if (temperatureValue > 25) {
    weatherIcon.src = 'img/sun.png';
    description.textContent = 'Sunny';
  } 
  else if (temperatureValue >= 15) {
    weatherIcon.src = 'img/sunobloko.png';
    description.textContent = 'Partly Cloudy';

  } 
  else if (data.current.relative_humidity_2m > 80) { // я тут пример сделал например если влажность > 80% — картинка дождь
    weatherIcon.src = 'img/dojd.png'; 
    description.textContent = 'Rainy';
  } 
  else {
    weatherIcon.src = 'img/obloko.png';
    description.textContent = 'Cloudy';
  }
  

  app.appendChild(header);
  app.appendChild(mainWeather);
  app.appendChild(forecastHourly);
  app.appendChild(btns);
  document.body.appendChild(app);
}
