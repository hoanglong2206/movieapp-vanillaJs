"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = searchWrapper.querySelector("[search-field]");

  const searchResults = document.createElement("div");
  searchResults.classList.add("search-modal");

  document.querySelector("main").appendChild(searchResults);

  let searchTimeout;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResults.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResults.classList.add("active");
          searchResults.innerHTML = "";

          searchResults.innerHTML = `
            <p class="label">Results for</p>

            <h1 class="heading">${searchField.value}</h1>

            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);

            searchResults.querySelector(".grid-list").appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
