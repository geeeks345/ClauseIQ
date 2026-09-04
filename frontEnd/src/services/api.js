import axios from 'axios';

// Universal baseURL detector compatible with Webpack, Babel, CRA and MyAnatomy SandboxPro
const getBaseURL = () => {
  // 1. Check Standard React process.env (CRA / Webpack)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 2. Auto-detect MyAnatomy SandboxPro in browser (both .ai and .in domains)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host.includes('myanatomy') || host.includes('sandbox') || host.includes('capstone')) {
      return 'https://6a69acdee64fad7400e3e3f0-api-capstone.myanatomy.ai/api/v1';
    }
  }

  // 3. Fallback for localhost development
  return 'http://localhost:5000/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 45000,
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
      // LocalStorage fallback for sandboxed iframes
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
