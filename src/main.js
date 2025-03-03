import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { createImages, refs } from './js/pixabay-api';
import { hideLoadButton, hideLoader, showLoadButton, showLoader } from './js/render-functions';

const per_page = 40;
let page = 1;
let query = "";
let total = 0;

async function updateImages(e) {
  showLoader();

  if (!query) {
    hideLoadButton();
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    hideLoader();
    return;
  }
  total = await createImages(query, page, per_page);
  isMaxReached();
}

refs.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideLoadButton();
  query = e.target.elements.input.value.trim();
  page = 1;
  refs.gallery.innerHTML = '';
  await updateImages(e);
});

refs.loadMore.addEventListener('click', async (e) => {
  e.preventDefault();
  page += 1;
  await updateImages(e);
  scroll();
});

function scroll () {
  const bounding =  refs.gallery.firstElementChild.getBoundingClientRect();
  const height = bounding.height;

  scrollBy({
    'top': 2 * height,
    'behavior': "smooth",
  });
}

function isMaxReached() {
  const max_page = Math.ceil(total/per_page);
  if(page >= max_page) {
    hideLoadButton();
    iziToast.error({
      title: 'Error',
      message: `❌ We are sorry, but you have reached the end of search results.`,
      position: 'topRight',
      progressBar: false
    });
  } else {
    showLoadButton();
  }
}