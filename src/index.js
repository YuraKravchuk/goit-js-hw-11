import { refs } from './js/refs';
import { fetchQuery } from './js/api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const makeGallery = (gallery, container) => {
  const markup = gallery
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    

  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:<br>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:<br>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments:<br>${comments}</b>
    </p>
    <p class="info-item">
      <b>Download:<br>${downloads}</b>
    </p>
  </div>
  </div>`
    )
    .join('');
  container.insertAdjacentHTML('beforeend', markup);
};

let currentPage = 1;
let search = '';
// refs.loadMore.classList.add('hidden');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function openGallery(e) {
  e.preventDefault();

  refs.galleryBox.innerHTML = '';
  search = e.currentTarget.searchQuery.value.trim();
  // refs.loadMore.classList.remove('hidden');

  currentPage = 1;

  if (!search) {
    refs.loadMore.classList.add('hidden');

    Notiflix.Notify.failure('Please try again.');
    return;
  }

  resultQuery();
}

async function resultQuery() {
  try {
    const data = await fetchQuery(search, currentPage);
    const gallery = data.hits;
    const totalHits = data.totalHits;
    // console.log(totalHits);

    makeGallery(gallery, refs.galleryBox);
    lightbox.refresh();

    if (gallery.length === 0) {
      refs.loadMore.classList.add('hidden');

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
   
    }

    if (currentPage === Math.ceil(totalHits / 40)) {
      refs.loadMore.classList.add('hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    // } else {
    //   refs.loadMore.classList.remove('hidden');
    // }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  // refs.loadMore.classList.add('hidden');
}

async function loadMoreHandler() {
  currentPage += 1;
  await resultQuery();
}

refs.loadMore.addEventListener('click', loadMoreHandler);

refs.form.addEventListener('submit', openGallery);
