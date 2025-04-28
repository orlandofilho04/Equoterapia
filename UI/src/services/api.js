import axios from 'axios';

// Configuração base da API
const api = axios.create({
  // Mudando de localhost:8080 para o path completo
  baseURL: 'http://localhost:8080',
  timeout: 20000, // Aumentando o timeout para 20 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Token de teste fixo
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLWFwaSIsInN1YiI6IkpQMCIsImV4cCI6MTc0NTg3OTY0MH0.Pw_UuzjqK8nKRUibr0WfrusO5fOLA1ITieaIMED5u40';

// Teste de conexão com a API
const testarConexao = async () => {
  try {
    console.log('Testando conexão com a API...');
    const response = await axios.get('http://localhost:8080/actuator/health', {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    console.log('Conexão bem sucedida:', response.data);
    return true;
  } catch (error) {
    console.error('Falha na conexão com a API:', error.message);
    // Testar sem o token para verificar se é um problema de autenticação
    try {
      const responseWithoutToken = await axios.get('http://localhost:8080/actuator/health');
      console.log('Conexão sem token bem sucedida:', responseWithoutToken.data);
      console.warn('O problema parece ser com a autenticação, não com a conexão');
    } catch (innerError) {
      console.error('Falha também sem token:', innerError.message);
    }
    return false;
  }
};

// Executar teste de conexão imediatamente
testarConexao();

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

export default api;