const querySelector = (element) => document.querySelector(element);

//Section
const headerSection = querySelector('#header');
const trendingPreviewSection = querySelector('#trendingPreview');
const categoriesPreviewSection = querySelector('#categoriesPreview');
const genericSection = querySelector('#genericList');
const movieDetailSection = querySelector('#movieDetail');

//List & Containers
const searchForm = querySelector('#searchForm');
const trendingMoviePreviewList = querySelector('.trendingPreview-movieList');
const categoriesPreviewList = querySelector('.categoriesPreview-list');
const movieDetailCategoriesList = querySelector('#movieDetail .categories-list');
const relatedMoviesContainter = querySelector('.relatedMovies-scrollContainer');

//Elements
const headerTitle = querySelector('.header-title');
const arrowBtn = querySelector('.header-arrow');
const headerCategoryTitle = querySelector('.header-title--categoryView');

const searchFormInput = querySelector('#searchForm input');
const searchFormBtn = querySelector('.searchBtn');

const trendingBtn = querySelector('.trendingPreview-btn');

const movieDetailTitle = querySelector('.movieDetail-title');
const movieDetailDescription = querySelector('.movieDetail-description');
const movieDetailScore = querySelector('.movieDetail-score');