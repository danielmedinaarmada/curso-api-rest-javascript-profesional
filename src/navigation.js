let page=1;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
  location.hash = "#search=" + searchFormInput.value.trim();
});
trendingBtn.addEventListener("click", () => (location.hash = "#trends"));
arrowBtn.addEventListener("click", () => {
  if (document.domain !== "localhost") {
    location.hash = "#home";
  } else {
    history.back();
  }
});

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener("scroll", infiniteScroll, false); //vamos a escuchar cada vez que el usuario haga scroll

function navigator() {
  console.log({ location });

  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  const pages = [
    { name: "trends", hashStart: "#trends", render: trendsPages },
    { name: "search", hashStart: "#search=", render: searchPages },
    { name: "movie", hashStart: "#movie=", render: movieDetailsPage },
    { name: "category", hashStart: "#category", render: categoriesPages },
  ];
  const hash = location.hash;
  let redering = homePage;
  const searchIndexRenderPage = pages.findIndex((page) =>
    hash.startsWith(page.hashStart)
  );
  if (searchIndexRenderPage !== -1)
    redering = pages[searchIndexRenderPage].render;
  redering();

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, false);
  }
}

function homePage() {
  console.log("HOME!!!");

  //esto solo para movie.details, si esta aqui se la quitamos (header-container--long)
  headerSection.classList.remove("header-container--long");
  //cuando entremos a la vista de movieDetails, tambien le debemos quitar el backgroud del poster
  headerSection.style.background = "";
  // si estamos en el home no necesitamos la fechita
  arrowBtn.classList.add("inactive");
  // y si estamos en el header-tile, le quitamos la clase inactive
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  // al header category title, queremos esconderlo cada vez que no estemos en la vista de categorias
  headerCategoryTitle.classList.add("inactive");
  // en el home necesitamos el formulatio de busqueda le quitamos el inactive al form
  searchForm.classList.remove("inactive");
  // si tiene la clase inactive se la quitamos
  trendingPreviewSection.classList.remove("inactive");
  // si tiene la clase inactive se la quitamos
  categoriesPreviewSection.classList.remove("inactive");
  // en el home no tenemos una lista de peliculas en vertical, solo las vistas en horizonal
  genericSection.classList.add("inactive");
  // igual con el movie details
  movieDetailSection.classList.add("inactive");

  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function categoriesPages() {
  console.log("CATEGORIES!!!");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  // si estamos en el categories no necesitamos la fechita
  arrowBtn.classList.remove("inactive");
  // y si estamos categories en el header-tile, le add la clase inactive
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  // al header category title, queremos aparezca cuando estemos en la vista de categorias
  headerCategoryTitle.classList.remove("inactive");

  searchForm.classList.add("inactive");
  // en el home necesitamos el formulatio de busqueda le quitamos el inactive al form
  trendingPreviewSection.classList.add("inactive");
  // si tiene la clase inactive se la quitamos
  categoriesPreviewSection.classList.add("inactive");
  // si tiene la clase inactive se la quitamos
  genericSection.classList.remove("inactive");
  // en el home no tenemos una lista de peliculas en vertical, solo las vistas en horizonal
  movieDetailSection.classList.add("inactive");
  // igual con el movie details

  //['#category', 'id-name']
  const [, categoryData] = location.hash.split("=");
  const [categoryId, categoryName] = categoryData.split("-");
  headerCategoryTitle.innerText = decodeURI(categoryName);
  getMoviesByCategory(categoryId);
}

function movieDetailsPage() {
  console.log("MOVIE!!!");

  headerSection.classList.add("header-container--long");
  //headerSection.style.background = ''; //más tarde añadimos la url
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  //['$movie', '234567']
  const [, movieId] = location.hash.split("=");
  getMovieById(movieId);
}

function searchPages() {
  console.log("SEARCH!!!");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  //['#search', 'palabra']
  const [, query] = location.hash.split("=");
  getMoviesBySearch(decodeURI(query));
}

function trendsPages() {
  console.log("TRENDS!!!");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  headerCategoryTitle.innerText = 'Tendencias';

  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}
