"use strict";

const api_key = "0fc43711462b37839906abfd30d6c183";
const imageBaseUrl = "https://image.tmdb.org/t/p/";

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export { api_key, imageBaseUrl, fetchDataFromServer };
