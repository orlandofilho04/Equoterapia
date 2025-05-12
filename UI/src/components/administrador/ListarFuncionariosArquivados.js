import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarFuncionarios.css";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alert, Spinner, Dropdown } from 'react-bootstrap';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';

// Chave para armazenar IDs arquivados no localStorage (mesma do componente de ativos)
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

// Função para remover um ID da lista de arquivados
const removeArchivedId = (id) => {
  try {
    const currentIds = getArchivedIds();
    const newIds = currentIds.filter(archivedId => archivedId !== id);
    localStorage.setItem(ARCHIVED_IDS_KEY, JSON.stringify(newIds));
    return newIds;
  } catch (e) {
    console.error("Erro ao remover ID arquivado:", e);
    return getArchivedIds();
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

function ListarFuncionariosArquivados() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reactivateLoading, setReactivateLoading] = useState({});
  const [success, setSuccess] = useState(false);
  const [archivedIds, setArchivedIds] = useState([]);
  const navigate = useNavigate();

  // Carregar IDs arquivados do localStorage
  useEffect(() => {
    setArchivedIds(getArchivedIds());
  }, []);

  const fetchProfissionais = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obter a lista de IDs arquivados
      const currentArchivedIds = getArchivedIds();
      setArchivedIds(currentArchivedIds);
      
      if (currentArchivedIds.length === 0) {
        // Se não houver profissionais arquivados, retornar lista vazia
        setProfissionais([]);
        setError(null);
        setLoading(false);
        return;
      }
      
      // Buscar todos os profissionais da API
      const response = await api.get('/professional');
      console.log("Dados recebidos da API:", response.data);
      
      // Filtrar apenas os profissionais que estão arquivados (com IDs na lista de arquivados)
      const validProfessionals = Array.isArray(response.data) ? response.data.filter(prof => prof && prof.id) : [];
      const archivedProfessionals = validProfessionals.filter(prof => currentArchivedIds.includes(prof.id));
      
      console.log("Profissionais arquivados encontrados:", archivedProfessionals.length);
      setProfissionais(archivedProfessionals);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar profissionais arquivados. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao buscar profissionais arquivados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReactivate = async (id) => {
    if (!id || !window.confirm('Tem certeza que deseja reativar este funcionário?')) {
      return;
    }
    
    try {
      setReactivateLoading(prev => ({ ...prev, [id]: true }));
      setError(null);
      setSuccess(false);
      
      // Remover o ID da lista de arquivados
      const newArchivedIds = removeArchivedId(id);
      setArchivedIds(newArchivedIds);
      
      // Atualizar a lista de profissionais removendo o reativado
      setProfissionais(prev => prev.filter(prof => prof.id !== id));
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Erro ao reativar profissional:', err);
      setError('Erro ao reativar profissional. Por favor, tente novamente.');
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setReactivateLoading(prev => ({ ...prev, [id]: false }));
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
        // Validar se o profissional é um objeto válido
        if (!prof || typeof prof !== 'object') {
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
  }, [profissionais, searchTerm]);

  const filteredProfissionais = getFilteredProfissionais();

  const getRoleDisplay = useCallback((role) => {
    if (!role) return 'Não definido';
    
    switch (role.toString()) {
      case 'equoterapeuta':
        return 'Equoterapeuta';
      case 'equitador':
        return 'Equitador';
      case 'FISIOTERAPEUTA':
        return 'Fisioterapeuta';
      case 'FONOAUDIOLOGO':
        return 'Fonoaudiólogo';
      case 'PSICOLOGO':
        return 'Psicólogo';
      default:
        return role.toString();
    }
  }, []);

  // Função para gerar URLs de forma segura
  const getProfileUrl = useCallback((profissional) => {
    if (!profissional || !profissional.id) return '#';
    
    const role = profissional.role ? profissional.role.toString().toLowerCase() : '';
    
    if (role === 'equoterapeuta') {
      return `/dados-equoterapeuta-adm/${profissional.id}`;
    } else if (role === 'equitador') {
      return `/dados-equitador-adm/${profissional.id}`;
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
            Profissional reativado com sucesso!
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
              backgroundColor: '#f8f9fa',
              color: '#666',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #ddd',
              padding: '8px 16px'
            }}
            onClick={() => navigate('/listar-funcionarios-ativos')}
          >
            Funcionários ativos
          </button>
          <button 
            className="btn"
            style={{ 
              backgroundColor: '#9B2D20', 
              color: 'white',
              borderRadius: '0 4px 4px 0',
              padding: '8px 16px'
            }}
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
                Nenhum funcionário arquivado encontrado.
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
                    backgroundColor: '#9B2D20',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginRight: '15px'
                  }}
                >
                  Status: Arquivado
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
                    <Dropdown.Item onClick={() => handleReactivate(profissional?.id)}>
                      Reativar funcionário
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

export default ListarFuncionariosArquivados;
