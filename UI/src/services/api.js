import axios from 'axios';


// Rotas que não precisam de token de autenticação
const ignoreTokenRoutes = ['/auth/login', '/auth/register'];

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação e logging
api.interceptors.request.use((config) => {
  console.log('Enviando requisição:', config);
  
  // Verificar se a rota atual requer token de autenticação

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


// Interceptor para logging das respostas
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response);
    return response;
  },
  error => {
    console.error('Erro na requisição:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'Sem resposta do servidor',
      config: {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL
      }
    });
    
    // Mostrando erro mais detalhado
    if (error.response) {
      // O servidor respondeu com um código de status diferente de 2xx
      console.error(`Erro ${error.response.status}:`, error.response.data);
      
      // Verificar problemas de CORS
      if (error.response.status === 0) {
        console.error('Possível erro de CORS. Verifique se o servidor permite requisições de origem cruzada.');
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
    }
    
    return Promise.reject(error);
  }
);

export { api };
export default api;

