const baseUrl =
  'https://api.openweathermap.org/data/2.5/forecast?appid=454c40cf5a0b5b005766fe8d9e827229';

export default {
  Obj: null,
  fetchWeather(query) {
    return fetch(`${baseUrl}&q=${query}&units=metric&lang=en`)
      .then(response => response.json())
      .then(data => {
        const arrAll = [];
        for (const i of data.list) {
          const obj = {
            dt: i.dt,
            min: i.main.temp_min,
            max: i.main.temp_max,
            icon: i.weather[0].icon,
          };
          arrAll.push(obj);
        }

        return arrAll;
      });
  },
  // set setObject(obj) {
  //   this.Obj = obj;
  // },
};
