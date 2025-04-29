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

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isPublicRoute = ignoreTokenRoutes.some(route => config.url?.includes(route));
  if (isPublicRoute) return config;

  if (!token) {
    // Token não encontrado -> redireciona para login
    localStorage.setItem('authError', 'Acesso negado. Usuário não autenticado.');
    window.location.href = '/login';
    return Promise.reject(new Error("Usuário não autenticado."));
  }

  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      // Token expirado -> redireciona para login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.setItem('authError', 'Sessão expirada. Faça login novamente.');
      window.location.href = '/login';
      return Promise.reject(new Error("Token expirado."));
    }

    // Token válido -> adiciona no cabeçalho
    config.headers.Authorization = `Bearer ${token}`;
    return config;

  } catch (err) {
    // Erro ao analisar o token -> redireciona para login
    console.error("Erro ao analisar token:", err);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.setItem('authError', 'Token inválido. Faça login novamente.');
    window.location.href = '/login';
    return Promise.reject(new Error("Token inválido."));
  }
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para lidar com respostas e erros
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

