// src/services/api.js
import axios from "axios";

const ignoreTokenRoutes = ['/auth/login', '/auth/register'];

const api = axios.create({
  baseURL: "http://localhost:8080/",
});

api.interceptors.request.use((config) => {
  if (!ignoreTokenRoutes.includes(config.url)) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
