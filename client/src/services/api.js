import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('fitforge_token')) {
        localStorage.removeItem('fitforge_token');
        localStorage.removeItem('fitforge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
