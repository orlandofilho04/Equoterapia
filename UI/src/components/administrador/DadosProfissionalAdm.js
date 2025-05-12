import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquoterapeutaAdm.css'; // Reutilizar o CSS existente
import { Alert, Button, Spinner, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

// Função para exibir o nome do papel profissional de maneira formatada
const getRoleDisplay = (role) => {
  if (!role) return 'Profissional';
  
  switch (role.toString()) {
    case 'FISIOTERAPEUTA':
      return 'Fisioterapeuta';
    case 'FONOAUDIOLOGO':
      return 'Fonoaudiólogo';
    case 'PSICOLOGO':
      return 'Psicólogo';
    case 'equoterapeuta':
      return 'Equoterapeuta';
    default:
      return role.toString();
  }
};

// Função para formatar a data no formato desejado (17 Nov 2024 13:46 PM)
const formatCadastroDate = (dateStr) => {
  if (!dateStr) return 'Não informado'; // alterado para mostrar "Não informado" em vez de uma data padrão
  
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
  } catch (e) {
    return 'Não informado';
  }
};

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

// Função para mapear o gênero do backend para exibição no frontend
const mapGenderForDisplay = (gender) => {
  if (!gender) return 'Não informado';
  
  // Normalizar o valor para comparação
  const normalizedGender = gender.toString().toUpperCase();
  
  switch (normalizedGender) {
    case 'M':
      return 'Masculino';
    case 'F':
      return 'Feminino';
    case 'O':
      return 'Outro';
    default:
      return gender; // Manter o valor original se não for reconhecido
  }
};

// Função para mapear o gênero de exibição para o formato do backend
const mapGenderForBackend = (displayGender) => {
  if (!displayGender) return null;
  
  switch (displayGender) {
    case 'Masculino':
      return 'M';
    case 'Feminino':
      return 'F';
    case 'Outro':
      return 'O';
    default:
      return displayGender;
  }
};

const DadosProfissionalAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dados-pessoais');
  const [profissional, setProfissional] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    gender: '',
    cpf: '',
    createdAt: '',
    professionalRegistration: '',
    andeBrasilCourse: false,
    photoUrl: 'https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid'
  });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  
  // Estados para a aba de pacientes
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [pacientesList, setPacientesList] = useState([]);
  const [pacientesError, setPacientesError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se o profissional está arquivado
        const archivedIds = getArchivedIds();
        setIsArchived(archivedIds.includes(Number(id)));
        
        // Buscar dados do profissional
        try {
          console.log(`Buscando dados do profissional com ID: ${id}`);
          const response = await api.get(`/professional/${id}`);
          console.log('Resposta completa da API:', response);
          
          if (response.data) {
            console.log('Dados do profissional recebidos:', response.data);
            // Converter nome de papel (role) de backend para exibição no frontend, se necessário
            const professionalData = { ...response.data };
            
            // Garantir que todos os campos necessários existam, mesmo que vazios
            const defaultData = {
              name: 'Nome não disponível',
              role: '',
              email: '',
              phone: '',
              address: '',
              birthDate: '',
              gender: '',
              cpf: '',
              createdAt: '',
              professionalRegistration: '',
              andeBrasilCourse: false,
              photoUrl: 'https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid'
            };
            
            // Mesclar dados padrão com dados recebidos
            Object.keys(defaultData).forEach(key => {
              if (professionalData[key] === undefined || professionalData[key] === null) {
                professionalData[key] = defaultData[key];
              }
            });
            
            // Converter o valor do gender para exibição se estiver no formato do backend (M/F/O)
            if (professionalData.gender) {
              professionalData.displayGender = mapGenderForDisplay(professionalData.gender);
            }
            
            // Verificar se o role é uma string - se não for, converter para string
            if (professionalData.role && typeof professionalData.role !== 'string') {
              professionalData.role = String(professionalData.role);
              console.log('Role convertido para string:', professionalData.role);
            }
            
            // Mapear o enum de role do backend para o formato de exibição do registro profissional
            if (professionalData.role) {
              // Normalizar o valor do role para uppercase para evitar problemas de case-sensitivity
              const normalizedRole = professionalData.role.toString().toUpperCase();
              console.log('Role normalizado:', normalizedRole);
              
              switch (normalizedRole) {
                case "EQUOTERAPEUTA":
                  professionalData.professionalRegistration = "Equoterapeuta";
                  break;
                case "FISIOTERAPEUTA_COFFITO":
                case "FISIOTERAPEUTA COFFITO":
                  professionalData.professionalRegistration = "Fisioterapeuta - COFFITO";
                  break;
                case "FONOAUDIOLOGO_CREFONO":
                case "FONOAUDIOLOGO CREFONO":
                  professionalData.professionalRegistration = "Fonoaudiólogo - CREFONO";
                  break;
                case "PSICOLOGO_CRP":
                case "PSICOLOGO CRP":
                  professionalData.professionalRegistration = "Psicólogo - CRP";
                  break;
                case "PSICOPEDAGOGO_CFEP":
                case "PSICOPEDAGOGO CFEP":
                  professionalData.professionalRegistration = "Psicopedagogo - CFEP";
                  break;
                case "TERAPEUTA_OCUPACIONAL_COFFITO":
                case "TERAPEUTA OCUPACIONAL COFFITO":
                  professionalData.professionalRegistration = "Terapeuta Ocupacional - COFFITO";
                  break;
                case "EDUCADOR_FISICO_CREF":
                case "EDUCADOR FISICO CREF":
                  professionalData.professionalRegistration = "Educador Físico - CREF";
                  break;
                case "ASSISTENTE_SOCIAL_CFESS":
                case "ASSISTENTE SOCIAL CFESS":
                  professionalData.professionalRegistration = "Assistente Social - CFESS";
                  break;
                case "PEDAGOGO":
                  professionalData.professionalRegistration = "Pedagogo";
                  break;
                case "FISIOTERAPEUTA":
                  professionalData.professionalRegistration = "Fisioterapeuta - COFFITO";
                  break;
                case "FONOAUDIOLOGO":
                  professionalData.professionalRegistration = "Fonoaudiólogo - CREFONO";
                  break;
                case "PSICOLOGO":
                  professionalData.professionalRegistration = "Psicólogo - CRP";
                  break;
                default:
                  // Se não houver correspondência, usar o próprio valor como registro profissional
                  console.log(`Role não mapeado: ${professionalData.role}`);
                  professionalData.professionalRegistration = professionalData.role;
              }
            }
            
            console.log('Dados do profissional processados:', professionalData);
            setProfissional(professionalData);
            setFormData(professionalData);
          } else {
            console.error('Resposta da API não contém dados:', response);
            setError('A resposta da API não contém dados do profissional. O cadastro pode não ter sido concluído no backend.');
          }
        } catch (err) {
          console.error('Erro ao buscar dados do profissional:', err);
          
          // Exibir mensagem de erro apropriada
          if (err.response) {
            console.error('Resposta de erro completa:', err.response);
            if (err.response.status === 404) {
              setError('Profissional não encontrado no backend. O cadastro pode não ter sido concluído ou foi removido.');
            } else if (err.response.status === 403) {
              setError('Acesso negado (403). Você não tem permissão para visualizar este profissional ou sua sessão expirou.');
            } else if (err.response.status === 401) {
              setError('Não autorizado (401). Sua sessão pode ter expirado. Faça login novamente.');
            } else {
              setError(`Erro ${err.response.status} do servidor: ${err.response.data?.message || 'Erro desconhecido'}. O cadastro pode não estar completo no backend.`);
            }
          } else if (err.message) {
            if (err.message.includes('Network Error')) {
              setError('Erro de rede. Não foi possível conectar ao servidor para verificar se o cadastro foi concluído.');
            } else {
              setError(`Erro: ${err.message}. Não foi possível verificar se o cadastro foi concluído.`);
            }
          } else {
            setError('Não foi possível verificar se o cadastro foi concluído no backend. Verifique a conexão com o servidor.');
          }
        }
        
        // Tentar buscar pacientes, se disponível - Desativado devido a erros CORS
        // Não vamos mais tentar buscar pacientes já que estamos recebendo erros CORS consistentemente
        // Isso evita erros no console e melhora a experiência do usuário
        setPacientes([]);
        
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao verificar cadastro no backend. Por favor, tente novamente ou verifique a conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Efeito para carregar pacientes quando a aba for acessada
  useEffect(() => {
    const carregarPacientes = async () => {
      if (activeTab !== 'pacientes-cadastrados' || loadingPacientes) return;
      
      setLoadingPacientes(true);
      setPacientesError(null);
      
      try {
        console.log('Buscando pacientes para o profissional:', id);
        const response = await api.get(`/professional/${id}/pacients`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Pacientes obtidos:', response.data);
        setPacientesList(response.data || []);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        setPacientesError('Não foi possível obter a lista de pacientes. Verifique se o profissional tem pacientes vinculados.');
      } finally {
        setLoadingPacientes(false);
      }
    };
    
    carregarPacientes();
  }, [activeTab, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.role) {
      setError('Por favor, preencha os campos obrigatórios');
      return;
    }

    try {
      setSavingData(true);
      console.log('Enviando dados atualizados:', formData);

      // Preparar dados para o backend
      const dataToSend = { ...formData };
      
      // Garantir que os tipos de dados estão corretos
      if (dataToSend.birthDate && typeof dataToSend.birthDate === 'string') {
        // Formatar a data para o formato aceito pelo backend (ISO)
        const dateObj = new Date(dataToSend.birthDate);
        if (!isNaN(dateObj.getTime())) {
          dataToSend.birthDate = dateObj.toISOString().split('T')[0];
        }
      }
      
      // Remover campos que não existem no backend
      if ('andeBrasilCourse' in dataToSend) {
        delete dataToSend.andeBrasilCourse; // O backend não tem este campo
      }
      
      if ('professionalRegistration' in dataToSend) {
        // Mapear o registro profissional para o enum de role do backend
        switch (dataToSend.professionalRegistration) {
          case "Fisioterapeuta - COFFITO":
            dataToSend.role = "FISIOTERAPEUTA_COFFITO";
            break;
          case "Fonoaudiólogo - CREFONO":
            dataToSend.role = "FONOAUDIOLOGO_CREFONO";
            break;
          case "Psicólogo - CRP":
            dataToSend.role = "PSICOLOGO_CRP";
            break;
          case "Psicopedagogo - CFEP":
            dataToSend.role = "PSICOPEDAGOGO_CFEP";
            break;
          case "Terapeuta Ocupacional - COFFITO":
            dataToSend.role = "TERAPEUTA_OCUPACIONAL_COFFITO";
            break;
          case "Educador Físico - CREF":
            dataToSend.role = "EDUCADOR_FISICO_CREF";
            break;
          case "Assistente Social - CFESS":
            dataToSend.role = "ASSISTENTE_SOCIAL_CFESS";
            break;
          case "Pedagogo":
            dataToSend.role = "PEDAGOGO";
            break;
          case "Equoterapeuta":
            dataToSend.role = "EQUOTERAPEUTA";
            break;
        }
        delete dataToSend.professionalRegistration;
      }
      
      // Converter a exibição do gênero para o formato do backend (M/F/O)
      if (dataToSend.gender) {
        dataToSend.gender = mapGenderForBackend(dataToSend.gender);
      }
      
      if ('displayGender' in dataToSend) {
        delete dataToSend.displayGender; // Campo apenas para exibição
      }
      
      if ('photoUrl' in dataToSend) {
        delete dataToSend.photoUrl; // A foto é atualizada separadamente
      }
      
      // Se estiver enviando o CPF, garantir que está no formato correto
      if (dataToSend.cpf) {
        dataToSend.cpf = dataToSend.cpf.replace(/[.-]/g, ''); // Remover pontos e traços
      }
      
      console.log('Dados formatados para o backend:', dataToSend);
      
      // Fazer a requisição de atualização
      const response = await api.put(`/professional/${id}`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response && response.data) {
        console.log('Resposta da atualização:', response.data);
        setProfissional({...response.data, andeBrasilCourse: profissional.andeBrasilCourse});
        setSuccess(true);
        setIsEditing(false);
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        console.warn('Resposta de atualização não contém dados:', response);
        setError('A resposta do servidor não contém dados. A atualização pode não ter sido concluída.');
      }
    } catch (err) {
      console.error('Erro ao atualizar profissional:', err);
      
      if (err.response) {
        console.error('Resposta de erro completa:', err.response);
        const status = err.response.status;
        
        if (status === 403) {
          setError('Acesso negado (403). Você não tem permissão para atualizar este profissional.');
        } else if (status === 401) {
          setError('Não autorizado (401). Sua sessão pode ter expirado. Faça login novamente.');
        } else if (status === 400) {
          setError(`Erro de validação: ${err.response.data?.message || 'Verifique os dados informados'}`);
        } else {
          setError(`Erro ${status} do servidor: ${err.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          setError('Erro de rede. Não foi possível conectar ao servidor para atualizar os dados.');
        } else {
          setError(`Erro: ${err.message}`);
        }
      } else {
        setError('Ocorreu um erro desconhecido ao tentar atualizar os dados.');
      }
    } finally {
      setSavingData(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Tem certeza que deseja arquivar este profissional?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Armazenar localmente o ID como arquivado
      saveArchivedId(Number(id));
      setIsArchived(true);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/listar-funcionarios-arquivados');
      }, 2000);
    } catch (err) {
      console.error('Erro ao arquivar profissional:', err);
      setError('Erro ao arquivar profissional. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!window.confirm('Tem certeza que deseja reativar este profissional?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remover o ID da lista de arquivados
      removeArchivedId(Number(id));
      setIsArchived(false);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/listar-funcionarios-ativos');
      }, 2000);
    } catch (err) {
      console.error('Erro ao reativar profissional:', err);
      setError('Erro ao reativar profissional. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profissional) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error && !profissional) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  const renderDadosPessoais = () => (
    <>
      <div className="dados-identificacao mt-4">
        <h5 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>Dados de Identificação</h5>
        <div style={{ marginLeft: '0px' }}>
          {isEditing ? (
            // Campos editáveis
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label"><strong>Nome Completo:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="gender" className="form-label"><strong>Sexo:</strong></label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="cpf" className="form-label"><strong>CPF:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label"><strong>E-mail:</strong></label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label"><strong>Telefone:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label"><strong>Endereço:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="birthDate" className="form-label"><strong>Data de Nascimento:</strong></label>
                <input
                  type="date"
                  className="form-control"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate ? (formData.birthDate.includes('T') ? formData.birthDate.split('T')[0] : formData.birthDate.substring(0, 10)) : ''}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          ) : (
            // Exibição dos campos
            <>
              <p><strong>Nome Completo:</strong> {profissional.name}</p>
              <p><strong>Sexo:</strong> {profissional.displayGender || mapGenderForDisplay(profissional.gender)}</p>
              <p><strong>CPF:</strong> {profissional.cpf}</p>
              <p><strong>E-mail:</strong> {profissional.email}</p>
              <p><strong>Telefone:</strong> {profissional.phone}</p>
              <p><strong>Endereço:</strong> {profissional.address}</p>
              <p><strong>Data de Nascimento:</strong> {profissional.birthDate && profissional.birthDate !== '0002-01-01' ? 
                new Date(profissional.birthDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informado'}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="dados-profissionais mt-5">
        <h5 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>Dados Profissionais</h5>
        <div style={{ marginLeft: '0px' }}>
          {isEditing ? (
            <>
              <div className="mb-3">
                <label htmlFor="professionalRegistration" className="form-label"><strong>Registro Profissional:</strong></label>
                <Form.Select
                  className="form-select"
                  id="professionalRegistration"
                  name="professionalRegistration"
                  value={formData.professionalRegistration || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione o Registro Profissional</option>
                  <option value="Fisioterapeuta - COFFITO">Fisioterapeuta - COFFITO</option>
                  <option value="Fonoaudiólogo - CREFONO">Fonoaudiólogo - CREFONO</option>
                  <option value="Psicólogo - CRP">Psicólogo - CRP</option>
                  <option value="Psicopedagogo - CFEP">Psicopedagogo - CFEP</option>
                  <option value="Terapeuta Ocupacional - COFFITO">Terapeuta Ocupacional - COFFITO</option>
                  <option value="Educador Físico - CREF">Educador Físico - CREF</option>
                  <option value="Assistente Social - CFESS">Assistente Social - CFESS</option>
                  <option value="Pedagogo">Pedagogo</option>
                  <option value="Equoterapeuta">Equoterapeuta</option>
                </Form.Select>
              </div>

              <div className="mb-3">
                <label htmlFor="andeBrasilCourse" className="form-label"><strong>Curso da ANDE-BRASIL:</strong></label>
                <select
                  className="form-select"
                  id="andeBrasilCourse"
                  name="andeBrasilCourse"
                  value={formData.andeBrasilCourse ? 'true' : 'false'}
                  onChange={(e) => setFormData({...formData, andeBrasilCourse: e.target.value === 'true'})}
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
                <small className="form-text text-muted">Esta informação é armazenada apenas localmente.</small>
              </div>
            </>
          ) : (
            <>
              <p><strong>Registro Profissional:</strong> {profissional.professionalRegistration || 'Não informado'}</p>
              <p><strong>Curso da ANDE-BRASIL:</strong> {profissional.andeBrasilCourse ? 'Sim' : 'Não'}</p>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 d-flex justify-content-end">
          <button 
            className="btn btn-secondary me-2"
            onClick={() => {
              setIsEditing(false);
              setFormData(profissional);
            }}
            disabled={savingData}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={savingData}
          >
            {savingData ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : 'Salvar alterações'}
          </button>
        </div>
      )}
    </>
  );

  const renderPacientesCadastrados = () => {
    // Renderizar mensagem de erro se houver
    if (pacientesError) {
      return (
        <div className="mt-4">
          <Alert variant="warning">
            <strong>Não foi possível carregar os pacientes</strong>
            <p className="mb-0 mt-2">{pacientesError}</p>
          </Alert>
        </div>
      );
    }
    
    // Renderizar loading
    if (loadingPacientes) {
      return (
        <div className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando pacientes...</span>
          </Spinner>
          <p className="mt-2">Carregando lista de pacientes...</p>
        </div>
      );
    }
    
    // Renderizar lista vazia
    if (pacientesList.length === 0) {
      return (
        <div className="mt-4">
          <Alert variant="info">
            <strong>Nenhum paciente vinculado</strong>
            <p className="mb-0 mt-2">Este profissional ainda não possui pacientes vinculados ao seu cadastro.</p>
            <p className="mb-0 mt-2">Os pacientes são vinculados automaticamente quando:</p>
            <ul className="mb-0 mt-2">
              <li>O profissional realiza um atendimento para o paciente</li>
              <li>O profissional é designado como responsável pelo paciente</li>
            </ul>
          </Alert>
        </div>
      );
    }
    
    // Renderizar lista de pacientes
    return (
      <div className="mt-4">
        <h5 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>Pacientes atendidos por este profissional</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Idade</th>
                <th scope="col">Responsável</th>
                <th scope="col">Telefone</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientesList.map(paciente => (
                <tr key={paciente.id}>
                  <td>{paciente.name}</td>
                  <td>
                    {paciente.birthDate 
                      ? Math.floor((new Date() - new Date(paciente.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)) 
                      : 'N/A'}
                  </td>
                  <td>{paciente.responsibleName || 'N/A'}</td>
                  <td>{paciente.phone || 'N/A'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/informacoes-praticante/${paciente.id}`)}
                    >
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
      <div style={{ padding: '20px' }}>
        {/* Cabeçalho com foto e informações do profissional */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <img 
              src={profissional?.photoUrl || "https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"}
              alt="Profissional"
              className="rounded-circle me-3"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div>
              <h4 className="mb-0" style={{ color: '#48b93c' }}>{profissional.name}</h4>
              <p className="mb-0" style={{ color: '#48b93c' }}>{getRoleDisplay(profissional.role)}</p>
            </div>
          </div>
          <div className="text-end">
            <p className="mb-2"><strong>Data de cadastro:</strong> {formatCadastroDate(profissional.createdAt)}</p>
            <button 
              className="btn btn-sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={savingData}
              style={{ 
                backgroundColor: '#9B2D20', 
                color: '#fff',
                borderRadius: '4px'
              }}
            >
              Editar informações
            </button>
          </div>
        </div>

        {/* Navegação entre as abas */}
        <div className="d-flex mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
          <div 
            className={`me-4 pb-2 ${activeTab === 'dados-pessoais' ? 'border-bottom border-3' : ''}`}
            style={{ 
              cursor: 'pointer',
              color: activeTab === 'dados-pessoais' ? '#9B2D20' : '#333',
              fontWeight: activeTab === 'dados-pessoais' ? 'bold' : 'normal',
              borderColor: '#9B2D20'
            }}
            onClick={() => setActiveTab('dados-pessoais')}
          >
            Dados Pessoais
          </div>
          <div 
            className={`pb-2 ${activeTab === 'pacientes-cadastrados' ? 'border-bottom border-3' : ''}`}
            style={{ 
              cursor: 'pointer',
              color: activeTab === 'pacientes-cadastrados' ? '#9B2D20' : '#333',
              fontWeight: activeTab === 'pacientes-cadastrados' ? 'bold' : 'normal',
              borderColor: '#9B2D20'
            }}
            onClick={() => setActiveTab('pacientes-cadastrados')}
          >
            Pacientes Cadastrados
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'dados-pessoais' && renderDadosPessoais()}
        {activeTab === 'pacientes-cadastrados' && renderPacientesCadastrados()}
        
        {/* Mensagens de sucesso/erro */}
        {success && (
          <Alert variant="success" className="mt-3">
            Dados atualizados com sucesso!
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {/* Botões de arquivar/reativar */}
        {!isEditing && (
          <div className="mt-4 d-flex justify-content-end">
            {isArchived ? (
              <button 
                className="btn"
                onClick={handleReactivate}
                disabled={loading}
                style={{ backgroundColor: '#28a745', color: '#fff' }}
              >
                Reativar Profissional
              </button>
            ) : (
              <button 
                className="btn"
                onClick={handleArchive}
                disabled={loading}
                style={{ backgroundColor: '#9B2D20', color: '#fff' }}
              >
                Arquivar Profissional
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DadosProfissionalAdm; 