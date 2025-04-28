import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Token de teste fixo
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLWFwaSIsInN1YiI6IkpQMCIsImV4cCI6MTc0NTg3OTY0MH0.Pw_UuzjqK8nKRUibr0WfrusO5fOLA1ITieaIMED5u40';

api.interceptors.request.use(request => {
  console.log('Enviando requisição:', request);
  
  // Adiciona o token de autenticação em todas as requisições
  request.headers['Authorization'] = `Bearer ${TEST_TOKEN}`;
  
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