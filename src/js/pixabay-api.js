import axios from 'axios';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('#input'),
  button: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader-box'),
  loadMore: document.querySelector('.load-btn'),
};

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

  try {
    const data = await axios.get(BASE_URL, { params });
    return data.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
