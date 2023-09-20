import axios from 'axios';

const API_KEY = '39532592-32a806c0e1762fd546d999b83';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchQuery(query, currentPage = '1') {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: currentPage,
  };
  const response = await axios.get(BASE_URL, { params });
  const data = response.data;

  return data;
}
