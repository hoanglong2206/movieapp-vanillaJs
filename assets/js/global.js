"use strict";

const addEventOnElements = function (elements, event, callback) {
  for (const element of elements) {
    element.addEventListener(event, callback);
  }
};

// Toggle Search

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("genreName", genreName);
  window.localStorage.setItem("urlParam", urlParam);
};
