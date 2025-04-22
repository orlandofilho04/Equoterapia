import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(request => {
  console.log('Enviando requisição:', request);
  return request;
});

api.interceptors.response.use(
    response => {
      console.log('Resposta recebida:', response);
      return response;
    },
    error => {
      console.error('Erro na requisição:', {
        message: error.message,
        response: error.response,
        config: error.config
      });
      return Promise.reject(error);
    }
);

export default api;