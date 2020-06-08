const baseUrl =
  'https://pixabay.com/api/?key=16586692-805de439588b17aa1d0d1f1cd';

export default {
  fetchImg(query) {
    return fetch(
      `${baseUrl}&q=${query}&image_type=photo&per_page=3&page=1&category=places&image_type=photo`,
    ).then(response => response.json());
  },
};
