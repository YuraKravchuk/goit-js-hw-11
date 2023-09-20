import { refs } from './js/refs';
import { fetchQuery } from './js/api';
import axios from 'axios';
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

async function openGallery(e) {
  e.preventDefault();
  refs.loadMore.classList.add('hidden');

  refs.galleryBox.innerHTML = '';
  search = e.currentTarget.searchQuery.value.trim();

  currentPage = 1;

  if (!search) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  resultQuery();
}

async function resultQuery() {
  try {
    const data = await fetchQuery(search, currentPage);
    const gallery = data.hits;

    const totalHits = data.totalHits;
    makeGallery(gallery, refs.galleryBox);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    if (gallery.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (currentPage * 40 >= totalHits) {
      refs.loadMore.classList.add('hidden');
      refs.loadMore.addEventListener('click', loadMoreHandler);

      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  refs.loadMore.classList.add('hidden');
}

async function loadMoreHandler() {
  currentPage += 1;
  await resultQuery();
}

refs.loadMore.addEventListener('click', loadMoreHandler);

refs.form.addEventListener('submit', openGallery);