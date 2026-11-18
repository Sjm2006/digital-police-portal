
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const csrfToken = sessionStorage.getItem('csrf_token');

  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  // Handle multipart/form-data file uploads.
  // The browser must set the multipart boundary automatically.
  if (
    typeof FormData !== 'undefined' &&
    config.data instanceof FormData
  ) {
    delete config.headers['Content-Type'];
    delete config.headers['content-type'];
  }

  return config;
});

export default apiClient;
