import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { hideLoader, imagesTemplate } from './render-functions';

export const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('#input'),
  button: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader-box'),
  loadMore: document.querySelector('.load-btn'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


export async function createImages(query, page, per_page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '49003886-a24f9c3a0fd607f8ed8b1fc56';
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: per_page,
  };

  const { data, error } = await axios.get(BASE_URL, { params })

  if(!error) {
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: `No images found for your search.`,
        position: 'topRight',
        progressBar: false
      });
    } else {
      refs.input.value = '';
      const markup = imagesTemplate(data.hits);
      refs.gallery.insertAdjacentHTML("beforeend", markup);
      lightbox.refresh();
    }
    return data.total;
  } else {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: `❌ Error fetching images. Please try again ${error}`,
      position: 'topRight',
      progressBar: false
    });
  }
}
