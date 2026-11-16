import axios from 'axios';

// Single shared Axios instance. Session cookie auth => withCredentials is required.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

export default apiClient;
