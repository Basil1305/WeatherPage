const baseUrl =
  'https://api.openweathermap.org/data/2.5/weather?appid=454c40cf5a0b5b005766fe8d9e827229';

export default {
  fetchWeather(query) {
    return fetch(`${baseUrl}&q=${query}&units=metric`).then(response =>
      response.json(),
    );
  },
};
