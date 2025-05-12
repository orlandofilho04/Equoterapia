import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarFuncionarios.css";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alert, Spinner, Dropdown } from 'react-bootstrap';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';

// Chave para armazenar IDs arquivados no localStorage
const ARCHIVED_IDS_KEY = 'equoterapia_archived_professional_ids';

// Função para obter os IDs arquivados do localStorage
const getArchivedIds = () => {
  try {
    const saved = localStorage.getItem(ARCHIVED_IDS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Erro ao ler IDs arquivados:", e);
    return [];
  }
};

// Função para salvar IDs arquivados no localStorage
const saveArchivedId = (id) => {
  try {
    const currentIds = getArchivedIds();
    if (!currentIds.includes(id)) {
      const newIds = [...currentIds, id];
      localStorage.setItem(ARCHIVED_IDS_KEY, JSON.stringify(newIds));
    }
  } catch (e) {
    console.error("Erro ao salvar ID arquivado:", e);
  }
};

// Função para formatar a data no formato desejado (17 Nov 2024 7:30 AM)
const formatDate = (dateStr) => {
  if (!dateStr) return 'Data não disponível';
  
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    
    return `${day} ${month} ${year} ${displayHour}:${minute} ${ampm}`;
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return 'Data inválida';
  }
};

function ListarFuncionariosAtivos() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveLoading, setArchiveLoading] = useState({});
  const [success, setSuccess] = useState(false);
  const [archivedIds, setArchivedIds] = useState([]);
  const navigate = useNavigate();

  // Carregar IDs arquivados do localStorage
  useEffect(() => {
    setArchivedIds(getArchivedIds());
  }, []);

  // Usando useCallback para evitar recriações desnecessárias da função
  const fetchProfissionais = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Iniciando busca de profissionais no backend...");
      
      let profissionaisData;
      
      try {
        const response = await api.get('/professional');
        console.log("Dados recebidos da API:", response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Resposta da API não contém um array:", response.data);
          throw new Error("O servidor retornou dados em formato inválido.");
        }
        
        profissionaisData = response.data;
      } catch (apiError) {
        console.error("Erro na chamada da API (possível erro CORS):", apiError);
        console.log("Usando dados fictícios para testes");
        
        // Dados fictícios para teste quando o backend não está disponível
        profissionaisData = [
          {
            id: "1",
            name: "João Silva",
            role: "EQUITADOR",
            email: "joao.silva@exemplo.com",
            phone: "(11) 9 9999-9999",
            createdAt: "2023-01-01T00:00:00",
            photoUrl: null
          },
          {
            id: "2",
            name: "Maria Santos",
            role: "FISIOTERAPEUTA",
            email: "maria.santos@exemplo.com",
            phone: "(11) 9 8888-8888",
            createdAt: "2023-02-01T00:00:00",
            photoUrl: null
          },
          {
            id: "3",
            name: "Pedro Oliveira",
            role: "EQUOTERAPEUTA",
            email: "pedro.oliveira@exemplo.com",
            phone: "(11) 9 7777-7777",
            createdAt: "2023-03-01T00:00:00",
            photoUrl: null
          },
          {
            id: "4",
            name: "Ana Costa",
            role: "PSICOLOGO",
            email: "ana.costa@exemplo.com",
            phone: "(11) 9 6666-6666",
            createdAt: "2023-04-01T00:00:00",
            photoUrl: null
          }
        ];
        
        setError("Aviso: Usando dados fictícios porque o backend não está disponível. Isso é apenas para visualização e teste.");
      }
      
      // Garantir que todos os itens são válidos e possuem ID
      const validProfessionals = profissionaisData.filter(prof => prof && prof.id);
      console.log(`${validProfessionals.length} profissionais válidos encontrados`);
      
      if (validProfessionals.length !== profissionaisData.length) {
        console.warn(`${profissionaisData.length - validProfessionals.length} registros inválidos foram filtrados`);
      }
      
      // Remover profissionais arquivados localmente
      const activeArchivedIds = getArchivedIds();
      console.log("IDs arquivados localmente:", activeArchivedIds);
      
      const filteredProfessionals = validProfessionals.filter(prof => !activeArchivedIds.includes(prof.id));
      console.log(`${filteredProfessionals.length} profissionais ativos após filtrar arquivados`);
      
      setProfissionais(filteredProfessionals);
    } catch (err) {
      console.error('Erro ao processar dados de profissionais:', err);
      
      if (err.response) {
        const status = err.response.status;
        console.error(`Erro ${status} do servidor:`, err.response.data);
        
        if (status === 403) {
          setError("Acesso negado (403). Você não tem permissão para listar profissionais. Sua sessão pode ter expirado.");
        } else if (status === 401) {
          setError("Autenticação necessária (401). Por favor, faça login novamente.");
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError(`Erro ${status} ao tentar listar profissionais: ${err.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          setError("Erro de conexão com o servidor. Verifique se o backend está em execução.");
        } else {
          setError(`Erro ao listar profissionais: ${err.message}`);
        }
      } else {
        setError('Erro desconhecido ao listar profissionais. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleArchive = async (id) => {
    if (!id || !window.confirm('Tem certeza que deseja arquivar este funcionário?')) {
      return;
    }

    try {
      setArchiveLoading(prev => ({ ...prev, [id]: true }));
      setError(null);
      setSuccess(false);

      // Armazenar localmente o ID como arquivado
      saveArchivedId(id);
      setArchivedIds(prev => [...prev, id]);
      
      // Remover da lista de profissionais
      setProfissionais(prev => prev.filter(prof => prof.id !== id));
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Erro ao arquivar profissional:', err);
      setError('Erro ao arquivar profissional. Por favor, tente novamente.');
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setArchiveLoading(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Função segura para verificar e filtrar profissionais
  const getFilteredProfissionais = useCallback(() => {
    if (!Array.isArray(profissionais)) {
      return [];
    }

    // Garantir que searchTerm é uma string válida
    const query = (searchTerm || '').toLowerCase();
    
    try {
      return profissionais.filter(prof => {
        // Validar se o profissional é um objeto válido e não está arquivado
        if (!prof || typeof prof !== 'object' || archivedIds.includes(prof.id)) {
          return false;
        }
        
        // Obter os valores de forma segura, garantindo que sejam strings
        let name = '';
        let role = '';
        
        try {
          name = typeof prof.name === 'string' ? prof.name.toLowerCase() : 
                 prof.name ? String(prof.name).toLowerCase() : '';
        } catch (e) {
          name = '';
        }
        
        try {
          role = typeof prof.role === 'string' ? prof.role.toLowerCase() : 
                 prof.role ? String(prof.role).toLowerCase() : '';
        } catch (e) {
          role = '';
        }
        
        // Busca por nome ou função
        return name.includes(query) || role.includes(query);
      });
    } catch (err) {
      console.error("Erro ao filtrar profissionais:", err);
      return [];
    }
  }, [profissionais, searchTerm, archivedIds]);

  const filteredProfissionais = getFilteredProfissionais();

  const getRoleDisplay = useCallback((role) => {
    if (!role) return 'Não definido';
    
    // Garantir que role seja uma string antes de tentar normalizar
    let normalizedRole = '';
    try {
      normalizedRole = (role || '').toString().toUpperCase();
      console.log("Role normalizado:", normalizedRole);
    } catch (e) {
      console.error("Erro ao normalizar role:", e);
      return 'Não definido';
    }
    
    switch (normalizedRole) {
      case 'EQUOTERAPEUTA':
        return 'Equoterapeuta';
      case 'EQUITADOR':
        return 'Equitador';
      case 'FISIOTERAPEUTA':
        return 'Fisioterapeuta';
      case 'FISIOTERAPEUTA_COFFITO':
      case 'FISIOTERAPEUTA COFFITO':
        return 'Fisioterapeuta - COFFITO';
      case 'FONOAUDIOLOGO':
        return 'Fonoaudiólogo';
      case 'FONOAUDIOLOGO_CREFONO':
      case 'FONOAUDIOLOGO CREFONO':
        return 'Fonoaudiólogo - CREFONO';
      case 'PSICOLOGO':
        return 'Psicólogo';
      case 'PSICOLOGO_CRP':
      case 'PSICOLOGO CRP':
        return 'Psicólogo - CRP';
      case 'PSICOPEDAGOGO_CFEP':
      case 'PSICOPEDAGOGO CFEP':
        return 'Psicopedagogo - CFEP';
      case 'TERAPEUTA_OCUPACIONAL_COFFITO':
      case 'TERAPEUTA OCUPACIONAL COFFITO':
        return 'Terapeuta Ocupacional - COFFITO';
      case 'EDUCADOR_FISICO_CREF':
      case 'EDUCADOR FISICO CREF':
        return 'Educador Físico - CREF';
      case 'ASSISTENTE_SOCIAL_CFESS':
      case 'ASSISTENTE SOCIAL CFESS':
        return 'Assistente Social - CFESS';
      case 'PEDAGOGO':
        return 'Pedagogo';
      default:
        return role.toString();
    }
  }, []);

  // Função para gerar URLs de forma segura
  const getProfileUrl = useCallback((profissional) => {
    if (!profissional || !profissional.id) return '#';
    
    // Assegurando que obtemos o role e normalizamos para comparação
    let role = '';
    try {
      role = (profissional.role || '').toString().toLowerCase();
    } catch (e) {
      console.error("Erro ao obter role do profissional:", e);
      role = '';
    }
    
    console.log("Role do profissional:", role, "ID:", profissional.id);
    
    if (role === 'equitador') {
      return `/dados-equitador-adm/${profissional.id}`;
    } else if (role === 'equoterapeuta') {
      return `/dados-equoterapeuta-adm/${profissional.id}`;
    } else {
      // Para outros tipos de profissionais (fisioterapeuta, fonoaudiólogo, psicólogo, etc.)
      return `/dados-profissional-adm/${profissional.id}`;
    }
  }, []);

  // Se estiver carregando inicialmente, mostre um spinner centralizado
  if (loading && profissionais.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container p-4">
      {/* Título principal */}
      <h2 className="mb-4" style={{ color: '#9B2D20', fontWeight: 'bold' }}>
        Funcionários cadastrados
      </h2>

      {/* Alertas de erro e sucesso */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          Profissional arquivado com sucesso!
        </Alert>
      )}

      {/* Campo de busca com ícone */}
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Procurar um Funcionário"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            borderRadius: '8px',
            paddingLeft: '15px',
            paddingRight: '40px',
            height: '40px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        />
        <FaSearch 
          className="position-absolute"
          style={{
            right: '15px',
            top: '12px',
            color: '#999',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Botões de navegação */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="btn-group">
          <button 
            className="btn"
            style={{ 
              backgroundColor: '#9B2D20', 
              color: 'white',
              borderRadius: '4px 0 0 4px',
              padding: '8px 16px'
            }}
          >
            Funcionários ativos
          </button>
          <button 
            className="btn" 
            style={{
              backgroundColor: '#f8f9fa',
              color: '#666',
              borderRadius: '0 4px 4px 0',
              border: '1px solid #ddd',
              padding: '8px 16px'
            }}
            onClick={() => navigate('/listar-funcionarios-arquivados')}
          >
            Funcionários inativos
          </button>
        </div>
        <button 
          className="btn"
          style={{ 
            backgroundColor: '#9B2D20', 
            color: 'white',
            borderRadius: '4px',
            padding: '8px 16px'
          }}
          onClick={() => navigate('/cadastro-profissional')}
        >
          Cadastre um novo Funcionário
        </button>
      </div>

      {/* Indicador de loading para atualizações */}
      {loading && profissionais.length > 0 && (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Atualizando...</span>
          </Spinner>
          <span className="ms-2">Atualizando lista...</span>
        </div>
      )}

      {/* Lista de funcionários */}
      <div className="list-group">
        {filteredProfissionais.length === 0 ? (
          <div className="alert alert-info">
            Nenhum funcionário encontrado.
          </div>
        ) : (
          filteredProfissionais.map((profissional) => (
            <div
              key={profissional?.id || Math.random()}
              className="list-group-item d-flex justify-content-between align-items-center mb-2"
              style={{
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f8f9fa'
              }}
            >
              {/* Informações do profissional */}
              <div className="d-flex align-items-center" style={{ flex: 1 }}>
                <Link to={getProfileUrl(profissional)}>
                  <img
                    src={profissional?.photoUrl || "https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"}
                    alt="Funcionário"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginRight: '15px'
                    }}
                  />
                </Link>
                
                <div style={{ minWidth: '150px' }}>
                  <h5 style={{ fontSize: '16px', margin: 0 }}>
                    <Link 
                      to={getProfileUrl(profissional)}
                      style={{ 
                        textDecoration: 'none', 
                        color: '#212529',
                        fontWeight: 'bold'
                      }}
                    >
                      {profissional?.name || 'Sem nome'}
                    </Link>
                  </h5>
                </div>
                
                <div style={{ minWidth: '120px', marginLeft: '20px' }}>
                  <span>{getRoleDisplay(profissional?.role)}</span>
                </div>
                
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  <span>Data de cadastro: {formatDate(profissional?.createdAt)}</span>
                </div>
              </div>
              
              {/* Status e ações */}
              <div className="d-flex align-items-center">
                <span 
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginRight: '15px'
                  }}
                >
                  Status: Ativo
                </span>
                
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="light" 
                    id={`dropdown-${profissional?.id}`}
                    style={{ 
                      border: 'none', 
                      background: 'none', 
                      padding: '4px'
                    }}
                  >
                    <FaEllipsisV color="#666" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleArchive(profissional?.id)}>
                      Arquivar funcionário
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={getProfileUrl(profissional)}>
                      Ver detalhes
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListarFuncionariosAtivos;
