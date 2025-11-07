import axios from 'axios';

// Normalize API base URL: ensure it ends with /api
const rawBase = (import.meta.env && import.meta.env.VITE_API_URL) as string | undefined;
const normalizedBase = (() => {
  if (!rawBase) return 'http://localhost:5000/api';
  // remove trailing slash, then ensure "/api" suffix
  const withoutSlash = rawBase.replace(/\/+$/, '');
  return withoutSlash.endsWith('/api') ? withoutSlash : `${withoutSlash}/api`;
})();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: normalizedBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically as it may cause issues
      // Let the component handle it
    }
    return Promise.reject(error);
  }
);

export default api;
