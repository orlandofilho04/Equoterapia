import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquitadorAdm.css';
import { Row, Col, Alert, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { api } from '../../services/api';

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

// Função para formatar a data no formato desejado (17 Nov 2024 13:46)
const formatCadastroDate = (dateStr) => {
  if (!dateStr) return 'Não informado';
  
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

const DadosEquitadorAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dadosPessoais');
  const [equitador, setEquitador] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [equinos, setEquinos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se o ID existe
        if (!id) {
          setError("ID do equitador não fornecido na URL");
          setLoading(false);
          return;
        }
        
        // Verificar se o equitador está arquivado
        const archivedIds = getArchivedIds();
        setIsArchived(archivedIds.includes(Number(id)));
        
        let equitadorData, equinosData;
        
        try {
          console.log("Buscando dados do equitador com ID:", id);
          
          const [equitadorResponse, equinosResponse] = await Promise.all([
            api.get(`/professional/${id}`),
            api.get(`/horses`)
          ]);
          
          if (equitadorResponse.data) {
            equitadorData = equitadorResponse.data;
            console.log("Dados do equitador recebidos:", equitadorData);
          } else {
            console.error('Resposta da API não contém dados:', equitadorResponse);
            throw new Error('A resposta da API não contém dados do equitador');
          }
          
          // Filtrar equinos associados ao equitador (essa lógica pode variar conforme o backend)
          const todosEquinos = equinosResponse.data || [];
          equinosData = todosEquinos.filter(equino => equino.equitadorId === parseInt(id) || equino.equitadorId === id);
          console.log("Dados dos equinos recebidos:", equinosData);
          
        } catch (apiError) {
          console.error("Erro na API:", apiError);
          
          if (apiError.response && apiError.response.status === 403) {
            throw new Error("Acesso negado (403). Você não tem permissão para visualizar este equitador ou sua sessão expirou.");
          } else if (apiError.response && apiError.response.status === 404) {
            throw new Error("Equitador não encontrado (404). O cadastro pode não existir no sistema.");
          }
          
          // Modo de contingência - usar dados fictícios quando o backend não responde
          console.log("Usando dados de equitador fictícios para teste");
          
          // Criar um equitador fictício para teste
          equitadorData = {
            id: id,
            name: "Equitador Exemplo",
            gender: "M",
            cpf: "123.456.789-00",
            email: "equitador@exemplo.com",
            phone: "(00) 9 9999-9999",
            address: "Rua Exemplo, 123",
            birthDate: "1990-01-01",
            formation: "Treinamento em Equitação",
            formationDate: "2015-01-01",
            createdAt: "2023-01-01T00:00:00",
            role: "EQUITADOR",
            photoUrl: null
          };
          
          // Criar equinos fictícios para teste
          equinosData = [
            {
              id: 1,
              name: "Pégaso",
              gender: "M",
              createdAt: "2023-01-01T00:00:00",
              status: "active",
              photoUrl: null
            },
            {
              id: 2,
              name: "Alazão",
              gender: "M",
              createdAt: "2023-02-01T00:00:00",
              status: "active",
              photoUrl: null
            }
          ];
          
          setError("Aviso: Usando dados fictícios porque o backend não está disponível ou houve erro na API. Isso é apenas para visualização e teste.");
        }
        
        if (!equitadorData) {
          setError("Dados do equitador não encontrados");
          setLoading(false);
          return;
        }
        
        setEquitador(equitadorData);
        setFormData(equitadorData);
        setEquinos(equinosData || []);
      } catch (err) {
        const errorMessage = err.message || 'Erro ao carregar dados. Por favor, tente novamente.';
        setError(errorMessage);
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.gender) {
      errors.gender = 'Sexo é obrigatório';
    }

    if (!formData.email?.includes('@')) {
      errors.email = 'Email inválido';
    }

    if (!formData.address?.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (!formData.formation?.trim()) {
      errors.formation = 'Formação é obrigatória';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro de validação quando o usuário começa a digitar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSavingData(true);
      setError(null);
      setSuccess(false);
      
      console.log('Enviando dados atualizados:', formData);
      
      // Preparar dados para envio
      const dataToSend = { ...formData };
      
      // Remover campos que não devem ser enviados
      if ('photoUrl' in dataToSend) {
        delete dataToSend.photoUrl;
      }
      
      const response = await api.put(`/professional/${id}`, dataToSend);
      
      if (response && response.data) {
        setEquitador(response.data);
        setIsEditing(false);
        setSuccess(true);
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      
      if (err.response) {
        if (err.response.status === 403) {
          setError('Acesso negado (403). Você não tem permissão para atualizar este equitador ou sua sessão expirou.');
        } else {
          setError(`Erro ${err.response.status}: ${err.response.data?.message || 'Erro ao atualizar dados'}`);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar dados. Por favor, tente novamente.');
      }
    } finally {
      setSavingData(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Tem certeza que deseja arquivar este equitador?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Armazenar localmente o ID como arquivado
      saveArchivedId(Number(id));
      setIsArchived(true);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/listar-funcionarios-arquivados');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao arquivar equitador. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao arquivar equitador:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!window.confirm('Tem certeza que deseja reativar este equitador?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Remover ID da lista de arquivados
      removeArchivedId(Number(id));
      setIsArchived(false);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/listar-funcionarios-ativos');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao reativar equitador. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao reativar equitador:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHorseStatusChange = async (horseId, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/horses/${horseId}/status`, { status: newStatus });
      setEquinos(equinos.map(horse =>
        horse.id === horseId
          ? { ...horse, status: newStatus }
          : horse
      ));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar status do cavalo. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao atualizar status do cavalo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !equitador) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p>Carregando dados do equitador...</p>
        </div>
      </div>
    );
  }

  if (error && !equitador) {
    return (
      <div className="container my-5">
        <Alert variant="danger">
          <Alert.Heading>Erro ao carregar dados</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => window.history.back()} variant="outline-danger">
              Voltar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!equitador) {
    return (
      <div className="container my-5">
        <Alert variant="warning">
          <Alert.Heading>Equitador não encontrado</Alert.Heading>
          <p>Não foi possível encontrar os dados deste equitador.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => window.history.back()} variant="outline-warning">
              Voltar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Função para renderizar Dados Pessoais
  const renderDadosPessoais = () => (
    <>
      <div className="dados-identificacao mt-4">
        <h5 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>Dados de Identificação</h5>
        <div style={{ marginLeft: '0px' }}>
          {isEditing ? (
            // Campos editáveis
            <>
              <div className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.gender}
                >
                  <option value="">Selecione o sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.gender}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  name="cpf"
                  value={formData.cpf || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.address}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate ? (formData.birthDate.includes('T') ? formData.birthDate.split('T')[0] : formData.birthDate.substring(0, 10)) : ''}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          ) : (
            // Exibição dos campos
            <>
              <p><strong>Nome Completo:</strong> {equitador.name || 'Não informado'}</p>
              <p><strong>Sexo:</strong> {equitador.gender === 'M' ? 'Masculino' : equitador.gender === 'F' ? 'Feminino' : 'Outro'}</p>
              <p><strong>CPF:</strong> {equitador.cpf || 'Não informado'}</p>
              <p><strong>E-mail:</strong> {equitador.email || 'Não informado'}</p>
              <p><strong>Telefone:</strong> {equitador.phone || 'Não informado'}</p>
              <p><strong>Endereço:</strong> {equitador.address || 'Não informado'}</p>
              <p><strong>Data de Nascimento:</strong> {equitador.birthDate && equitador.birthDate !== '0002-01-01' ? 
                new Date(equitador.birthDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informado'}</p>
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
                <Form.Label>Formação</Form.Label>
                <Form.Control
                  type="text"
                  name="formation"
                  value={formData.formation || ''}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.formation}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.formation}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <Form.Label>Data de Formação</Form.Label>
                <Form.Control
                  type="date"
                  name="formationDate"
                  value={formData.formationDate ? (formData.formationDate.includes('T') ? formData.formationDate.split('T')[0] : formData.formationDate.substring(0, 10)) : ''}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          ) : (
            <>
              <p><strong>Formação:</strong> {equitador.formation || 'Não informado'}</p>
              <p><strong>Data de Formação:</strong> {equitador.formationDate && equitador.formationDate !== '0002-01-01' ? 
                new Date(equitador.formationDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informado'}</p>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 d-flex justify-content-end">
          <Button 
            variant="secondary"
            className="me-2"
            onClick={() => {
              setIsEditing(false);
              setFormData(equitador);
              setValidationErrors({});
            }}
            disabled={savingData}
          >
            Cancelar
          </Button>
          <Button 
            variant="success"
            onClick={handleSubmit}
            disabled={savingData}
          >
            {savingData ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Salvando...
              </>
            ) : 'Salvar alterações'}
          </Button>
        </div>
      )}
    </>
  );

  // Função para renderizar Equinos Cadastrados
  const renderEquinosCadastrados = () => {
    // Se não houver equinos
    if (equinos.length === 0) {
      return (
        <div className="mt-4">
          <Alert variant="info">
            <strong>Nenhum equino vinculado</strong>
            <p className="mb-0 mt-2">Este equitador ainda não possui equinos vinculados ao seu cadastro.</p>
          </Alert>
        </div>
      );
    }
    
    // Renderiza a lista de equinos
    return (
      <div className="mt-4">
        <h5 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>Equinos vinculados a este equitador</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Foto</th>
                <th scope="col">Nome</th>
                <th scope="col">Sexo</th>
                <th scope="col">Data de Cadastro</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {equinos.map((equino) => (
                <tr key={equino.id}>
                  <td style={{ width: '60px' }}>
                    <img
                      src={equino.photoUrl || "https://img.freepik.com/fotos-gratis/bela-vista-de-um-magnifico-cavalo-branco-com-o-campo-verde_181624-14424.jpg"}
                      alt={equino.name}
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{equino.name}</td>
                  <td>{equino.gender === 'M' ? 'Masculino' : 'Feminino'}</td>
                  <td>{new Date(equino.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={equino.status === "active" ? "success" : "secondary"}>
                      {equino.status === "active" ? "Ativo" : "Arquivado"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={equino.status === "active" ? "outline-danger" : "outline-success"}
                      size="sm"
                      onClick={() => handleHorseStatusChange(equino.id, equino.status === "active" ? "archived" : "active")}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                      ) : null}
                      {equino.status === "active" ? "Arquivar" : "Reativar"}
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
        {/* Cabeçalho com foto e informações do equitador */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <img 
              src={equitador?.photoUrl || "https://pics.loveplanet.ru/2/foto/15/ce/15cee737/eEoqpJw==_.jpg"}
              alt="Equitador"
              className="rounded-circle me-3"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div>
              <h4 className="mb-0" style={{ color: '#48b93c' }}>{equitador.name}</h4>
              <p className="mb-0" style={{ color: '#48b93c' }}>Equitador</p>
            </div>
          </div>
          <div className="text-end">
            <p className="mb-2"><strong>Data de cadastro:</strong> {formatCadastroDate(equitador.createdAt)}</p>
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
            className={`me-4 pb-2 ${activeTab === 'dadosPessoais' ? 'border-bottom border-3' : ''}`}
            style={{ 
              cursor: 'pointer',
              color: activeTab === 'dadosPessoais' ? '#9B2D20' : '#333',
              fontWeight: activeTab === 'dadosPessoais' ? 'bold' : 'normal',
              borderColor: '#9B2D20'
            }}
            onClick={() => setActiveTab('dadosPessoais')}
          >
            Dados Pessoais
          </div>
          <div 
            className={`pb-2 ${activeTab === 'equinosCadastrados' ? 'border-bottom border-3' : ''}`}
            style={{ 
              cursor: 'pointer',
              color: activeTab === 'equinosCadastrados' ? '#9B2D20' : '#333',
              fontWeight: activeTab === 'equinosCadastrados' ? 'bold' : 'normal',
              borderColor: '#9B2D20'
            }}
            onClick={() => setActiveTab('equinosCadastrados')}
          >
            Equinos Cadastrados
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'dadosPessoais' ? renderDadosPessoais() : renderEquinosCadastrados()}
        
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
                Reativar Equitador
              </button>
            ) : (
              <button 
                className="btn"
                onClick={handleArchive}
                disabled={loading}
                style={{ backgroundColor: '#9B2D20', color: '#fff' }}
              >
                Arquivar Equitador
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DadosEquitadorAdm;
