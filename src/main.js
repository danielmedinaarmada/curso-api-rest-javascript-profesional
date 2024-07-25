//vamos a crear la configuracion por defecto que vamos a usa en nuestras consultas
// no lo podemos agregar header como defecto
// tambien podemos agregar parametros por defecto

//Data
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: API_KEY,
    language: "es",
  },
  headers: {
    "Content-Type": "application/json;utf-8",
  },
});

function likedMoviesList() {
  //devolvernos el array de movies que tenemos en localStorage
  const item = JSON.parse(localStorage.getItem("like_movies"));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList();

  console.log({ likedMovies });

  if (likedMovies[movie.id]) {
    delete likedMovies[movie.id];
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("like_movies", JSON.stringify(likedMovies));
}

// Helpers / Utils
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    //console.log(entry.target);
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      const alt = entry.target.getAttribute("data-alt");
      entry.target.setAttribute("src", url);
      entry.target.setAttribute("alt", alt);
      entry.target.removeAttribute("data-img");
      entry.target.removeAttribute("data-alt");
      lazyLoader.unobserve(entry.target);
    }
  });
});

function createMovies(
  data,
  container,
  { isLazyLoad = false, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  data.forEach((movie) => {
    // trendingMoviePreviewList
    // const trendingPrevieMovieContainter = document.querySelector(
    //   "#trendingPreview .trendingPreview-movieList"
    // );
    const movieContainter = document.createElement("div");
    movieContainter.classList.add("movie-container");
    movieContainter.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", "movie image");
    movieImg.setAttribute(isLazyLoad ? "data-alt" : "alt", movie.title);
    movieImg.setAttribute(
      isLazyLoad ? "data-img" : "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://static.platzi.com/static/images/error/img404.png"
      );
    });
    //https://via.placeholder.com/300x450/5c218a/ffffff?text=casa

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    
    //Aqui le preguntamos a ese objeto (localStorage) si tiene la pelicula
    likedMoviesList()[movie.id] && movieBtn.classList.add("movie-btn--liked")

    movieBtn.addEventListener("click", (e) => {
      movieBtn.classList.toggle("movie-btn--liked");
      e.stopPropagation();
      likeMovie(movie);
      getLikedMovies();
    });

    if (isLazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainter.appendChild(movieImg);
    movieContainter.appendChild(movieBtn);
    container.appendChild(movieContainter);
  });
}

function createCategory(categories, containter) {
  containter.innerHTML = "";
  categories.forEach((category) => {
    // categoriesPreviewList
    // const previewCategoriesContainer = document.querySelector(
    //   "#categoriesPreview .categoriesPreview-list"
    // );
    const categoryContainter = document.createElement("div");
    categoryContainter.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainter.appendChild(categoryTitle);
    containter.appendChild(categoryContainter);
  });
}

//Llamados a la API

//Peliculas en tendencias
async function getTrendingMoviesPreview() {
  const { data } = await api("/trending/movie/day"); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;

  console.log({ data, movies });

  createMovies(movies, trendingMoviePreviewList, {
    isLazyLoad: true,
    clean: true,
  });
}

//Lista de cateogorias o genero de peliculas
async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list"); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const categories = data.genres;
  console.log({ data, categories });
  createCategory(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
      language: "es",
    },
  }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;
  maxPage = data.total_pages;
  console.log({ data, movies });

  createMovies(movies, genericSection, {
    isLazyLoad: true,
    clean: true,
  });
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    console.log({ page, maxPage, scrollIsBottom, pageIsNotMax });

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("discover/movie", {
        params: {
          with_genres: id,
          page,
          language: "es",
        },
      }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
      const movies = data.results;

      createMovies(movies, genericSection, {
        isLazyLoad: true,
        clean: false,
      });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
      language: "es",
    },
  }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;
  maxPage = data.total_pages;

  console.log({ query, maxPage, movies, totalmovies: data });

  createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    console.log({ page, maxPage, scrollIsBottom, pageIsNotMax });

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          query,
          page,
          language: "es",
        },
      }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
      const movies = data.results;

      createMovies(movies, genericSection, {
        isLazyLoad: true,
        clean: false,
      });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await api("/trending/movie/day");
  //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    isLazyLoad: true,
    clean: true,
  });
}

function getPaginatedTrendingMovies() {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;
    console.log({ page, maxPage, scrollIsBottom, pageIsNotMax });

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("/trending/movie/day", {
        params: {
          page,
        },
      }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
      const movies = data.results;

      createMovies(movies, genericSection, {
        isLazyLoad: true,
        clean: false,
      });
    }
  };
}

async function getMovieById(movie_id) {
  // en actiox para renombrar data por movie
  const { data: movie } = await api("movie/" + movie_id, {
    params: {
      language: "es",
    },
  });

  console.log(movie);

  const movieImgURL = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgURL})
  `;
  console.log(movieImgURL);

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategory(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesId(movie_id);
}

async function getRelatedMoviesId(movie_id) {
  const { data } = await api(`movie/${movie_id}/similar`, {
    params: {
      language: "es",
    },
  });

  const relatedMovies = data.results;
  createMovies(relatedMovies, relatedMoviesContainter, {
    isLazyLoad: true,
    clean: true,
  });
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);
  createMovies(moviesArray, likedMoviesListArticle, { isLazyLoad: true, clean: true });
}
