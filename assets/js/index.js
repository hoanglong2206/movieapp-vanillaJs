"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Now Playing Movies",
    path: "/movie/now_playing",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreIdList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreIdList.push(this[genreId]);
    }
    return newGenreIdList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
      <div class="control-inner">
      </div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      poster_path,
      overview,
      vote_average,
      id,
    } = movie;
    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");
    sliderItem.innerHTML = ` 
      <img
        src="${imageBaseUrl}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading=${index === 0 ? "eager" : "lazy"}
      />

      <div class="banner-content">
        <h2 class="heading">${title}</h2>

        <div class="meta-list">
          <div class="meta-item">${release_date}</div>

          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>

        <p class="banner-text">${overview}</p>

        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />

          <span class="span">Watch Now</span>
        </a>
      </div>
      `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = ` <img
      src="${imageBaseUrl}w154${poster_path}"
      alt="${title}"
      loading="lazy"
      draggable="false"
      class="img-cover"
    />`;

    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();

  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let activeSlide = 0;

  const setActiveSlide = function (slideIndex) {
    sliderItems.forEach((slide) => {
      slide.classList.remove("active");
    });

    sliderControls.forEach((slide) => {
      slide.classList.remove("active");
    });

    sliderItems[slideIndex].classList.add("active");
    sliderControls[slideIndex].classList.add("active");
  };

  setActiveSlide(activeSlide);

  sliderControls.forEach((control) => {
    control.addEventListener("click", function () {
      activeSlide = this.getAttribute("slider-control");
      setActiveSlide(activeSlide);
    });
  });

  setInterval(() => {
    activeSlide++;
    if (activeSlide >= sliderItems.length) {
      activeSlide = 0;
    }
    setActiveSlide(activeSlide);
  }, 3000);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElement = document.createElement("section");
  movieListElement.classList.add("movie-list");
  movieListElement.ariaLabel = `${title}`;

  movieListElement.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>

    <div class="slider-list">
      <div class="slider-inner">
      </div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElement.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElement);
};

search();
