window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  console.log({ location });
  const pages = [
    { name: "trends", hashStart: "#trends", render: trendsPages },
    { name: "search", hashStart: "#search=", render: searchPages },
    { name: "movie", hashStart: "#movie=", render: movieDetailsPage },
    { name: "category", hashStart: "#category", render: categoriesPages },
  ];
  const hash = windows.location.hash;
  let redering = homePage;
  const searchIndexRenderPage = pages.findIndex(page => hash.startsWith(page.hashStart));
  if (searchIndexRenderPage !== -1 ) redering = pages[searchIndexRenderPage].render;
  redering();
}

function homePage() {
  console.log("HOME!!!");
  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function categoriesPages() {
  console.log("CATEGORIES!!!");
}

function movieDetailsPage() {
  console.log("MOVIE!!!");
}

function searchPages() {
  console.log("SEARCH!!!");
}

function trendsPages() {
  console.log("TRENDS!!!");
}
