
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { createImages, refs } from './js/pixabay-api';
import { hideLoadButton, hideLoader, renderHTML, showLoadButton, showLoader, flushGallery } from './js/render-functions';

const per_page = 40;
let page = 1;
let query = "";
let total = 0;
let data = null;

async function updateImages(e) {
  showLoader();

  try {
    data = await createImages(query, page, per_page);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `❌ Error fetching images. Please try again ${error}`,
      position: 'topRight',
      progressBar: false
    });
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Try again later!' });
  }
  finally {
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: `No images found for your search.`,
        position: 'topRight',
        progressBar: false
      });
    } else {
      refs.input.value = '';
      renderHTML(data);
      total = data.total;
     isMaxReached();
    }
    
  }
    hideLoader();
  }

  function isSearchExist() {
  if (!query) {
    hideLoadButton();
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    hideLoader();
    return 0;
  }
  return 1;
}

refs.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideLoadButton();
  query = e.target.elements.input.value.trim();
  page = 1;
  if (!isSearchExist()) return;
  flushGallery();
  await updateImages(e);
});

refs.loadMore.addEventListener('click', async (e) => {
  e.preventDefault();
  page += 1;
  if (!isSearchExist()) return;
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