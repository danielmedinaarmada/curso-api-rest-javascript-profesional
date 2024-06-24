window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator(){
  console.log({location});
  
  if (location.hash.startsWith('#trends')){
    trendsPages();
  } else if (location.hash.startsWith('#search=')){
    searchPages()
  } else if (location.hash.startsWith('#movie=')){
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')){
    categoriesPages();
  } else {
    homePage();
  }
}


function homePage(){
  console.log("HOME!!!");
  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function categoriesPages(){
  console.log("CATEGORIES!!!");
}

function movieDetailsPage(){
  console.log("MOVIE!!!");
}

function searchPages(){
  console.log("SEARCH!!!");
}

function trendsPages(){
  console.log("TRENDS!!!");
}