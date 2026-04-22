import axios from 'axios';

const configuredBase =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000';

const normalizedBase = String(configuredBase).replace(/\/+$/, '');
const baseURL = /\/api$/i.test(normalizedBase)
  ? normalizedBase
  : `${normalizedBase}/api`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pm_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
