//vamos a crear la configuracion por defecto que vamos a usa en nuestras consultas
// no lo podemos agregar header como defecto
// tambien podemos agregar parametros por defecto
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

//Peliculas en tendencias
async function getTrendingMoviesPreview() {
  const { data } = await api("/trending/movie/day"); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;

  console.log({ data, movies });

  trendingMoviePreviewList.innerHTML = "";
  movies.forEach((movie) => {
    // trendingMoviePreviewList
    // const trendingPrevieMovieContainter = document.querySelector(
    //   "#trendingPreview .trendingPreview-movieList"
    // );
    const movieContainter = document.createElement("div");
    movieContainter.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

    movieContainter.appendChild(movieImg);
    trendingMoviePreviewList.appendChild(movieContainter);
  });
}

//Lista de cateogorias o genero de peliculas
async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list"); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const categories = data.genres;

  console.log({ data, categories });

  categoriesPreviewList.innerHTML = "";
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
    categoryTitle.addEventListener('click', () => {
      location.hash=`#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainter.appendChild(categoryTitle);
    categoriesPreviewList.appendChild(categoryContainter);
  });
}


async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
      language: "es",
    }, 
  }); //la respuesta ya viene parseada en JSON y destructuramos status y/o data
  const movies = data.results;

  console.log({ data, movies });

  genericSection.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainter = document.createElement("div");
    movieContainter.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

    movieContainter.appendChild(movieImg);
    genericSection.appendChild(movieContainter);
  });
}