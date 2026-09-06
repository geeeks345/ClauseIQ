import axios from 'axios';

// Smart auto-detecting baseURL for Render Cloud, MyAnatomy SandboxPro & Localhost
const getBaseURL = () => {
  // 1. Explicit environment variable (if passed via Render or local .env)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 2. If running locally on localhost in development
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api/v1';
    }
  }

  // 3. Default Production Backend URL on Render Cloud
  return 'https://clauseiq-backend-vbfc.onrender.com/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('clauseiq_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Fallback for sandboxed iframes
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('clauseiq_token');
        localStorage.removeItem('clauseiq_user');
      } catch (e) {}

      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
