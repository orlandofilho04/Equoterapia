// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/", // ou a URL da sua API em produção
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
