import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Untuk refresh token cookies jika ada
});

// Request Interceptor: Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika 401 Unauthorized dan kita bukan di halaman login, bisa logout otomatis
    if (error.response?.status === 401) {
      Cookies.remove('token');
      // Redirect handled by client logic or proxy
    }
    return Promise.reject(error);
  }
);
