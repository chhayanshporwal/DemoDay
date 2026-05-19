// ==========================================
// Axios Instance — DemoDay API Client
// ==========================================

import axios from 'axios';
import { useStore } from '../store/useStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor: Attach auth token ----
api.interceptors.request.use(
  (config) => {
    const token = useStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor: Handle errors globally ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token expired or invalid — force logout
      useStore.getState().logout();
      window.location.href = '/login';
    }

    if (status === 429) {
      useStore.getState().pushToast({
        message: 'Too many requests. Please slow down.',
        severity: 'warning',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
