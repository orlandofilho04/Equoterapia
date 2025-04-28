import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquitadorAdm.css';
import { Row, Col, Alert, Button, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { api } from '../../services/api';

const DadosEquitadorAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conteudoAtivo, setConteudoAtivo] = useState('dadosPessoais');
  const [equitador, setEquitador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [equinos, setEquinos] = useState([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [equitadorResponse, equinosResponse] = await Promise.all([
          api.get(`/professionals/${id}`),
          api.get(`/horses/equitador/${id}`)
        ]);
        setEquitador(equitadorResponse.data);
        setFormData(equitadorResponse.data);
        setEquinos(equinosResponse.data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Erro ao carregar dados. Por favor, tente novamente.';
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
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const phoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.gender) {
      errors.gender = 'Sexo é obrigatório';
    }

    if (!cpfRegex.test(formData.cpf)) {
      errors.cpf = 'CPF inválido. Formato esperado: 000.000.000-00';
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.birthDate) {
      errors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.address?.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Telefone inválido. Formato esperado: (00) 0 0000-0000';
    }

    if (!formData.formation?.trim()) {
      errors.formation = 'Formação é obrigatória';
    }

    if (!formData.formationDate) {
      errors.formationDate = 'Data de conclusão é obrigatória';
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
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await api.put(`/professionals/${id}`, formData);
      setEquitador(formData);
      setIsEditing(false);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar dados. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao atualizar profissional:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/professionals/${id}/archive`);
      navigate('/listar-funcionarios-arquivados');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao arquivar profissional. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao arquivar profissional:', err);
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
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error && !equitador) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (!equitador) {
    return (
      <Alert variant="warning">
        Profissional não encontrado.
      </Alert>
    );
  }

  const renderDadosPessoais = () => (
    <>
      <div className="mt-5">
        <h5 className="title-adm mb-4">Dados de Identificação</h5>
        <ul className="list-unstyled">
          <li><strong className="color-brown">Nome Completo:</strong> {equitador.name}</li>
          <li><strong className="color-brown">Sexo:</strong> {equitador.gender === 'M' ? 'Masculino' : equitador.gender === 'F' ? 'Feminino' : 'Outro'}</li>
          <li><strong className="color-brown">CPF:</strong> {equitador.cpf}</li>
          <li><strong className="color-brown">E-mail:</strong> {equitador.email}</li>
          <li><strong className="color-brown">Telefone:</strong> {equitador.phone}</li>
          <li><strong className="color-brown">Endereço:</strong> {equitador.address}</li>
          <li><strong className="color-brown">Data de Nascimento:</strong> {new Date(equitador.birthDate).toLocaleDateString()}</li>
        </ul>
      </div>
      <div className="mt-5">
        <h5 className="title-adm mb-4">Dados Profissionais</h5>
        <ul className="list-unstyled">
          <li><strong className="color-brown">Formação:</strong> {equitador.formation}</li>
          <li><strong className="color-brown">Data de Conclusão:</strong> {new Date(equitador.formationDate).toLocaleDateString()}</li>
        </ul>
      </div>
    </>
  );

  const renderEquinosCadastrados = (equinos) =>
    equinos.map((equi) => (
      <div key={equi.id} className="sessao-item d-flex align-items-center mb-3 p-3">
        <img src={equi.photoUrl || "https://img.freepik.com/fotos-gratis/bela-vista-de-um-magnifico-cavalo-branco-com-o-campo-verde_181624-14424.jpg"} alt="Avatar" className="sessao-avatar me-3" />
        <div className="sessao-info flex-grow-1 d-flex justify-content-between align-items-center">
          <p className="mb-0"><strong>{equi.name}</strong></p>
          <p className="mb-0">Sexo: {equi.gender === 'M' ? 'Masculino' : 'Feminino'}</p>
          <p className="mb-0">Data de cadastro: {new Date(equi.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="d-flex align-items-center">
          <Badge bg={equi.status === "active" ? "success" : "secondary"} className="me-3">
            Status: {equi.status === "active" ? "Ativo" : "Arquivado"}
          </Badge>
          <Button
            variant={equi.status === "active" ? "outline-danger" : "outline-success"}
            size="sm"
            onClick={() => handleHorseStatusChange(equi.id, equi.status === "active" ? "archived" : "active")}
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
            {equi.status === "active" ? "Arquivar" : "Reativar"}
          </Button>
        </div>
      </div>
    ));

  return (
    <div className="container my-5">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          Dados atualizados com sucesso!
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={2}>
          <img
            src={equitador.photoUrl || "https://pics.loveplanet.ru/2/foto/15/ce/15cee737/eEoqpJw==_.jpg"}
            alt="Foto do usuário"
            className="img-fluid rounded-circle img-adm"
          />
        </Col>

        <Col>
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="title-adm">{equitador.name}</h3>
              <p className="sub-title-adm">Equitador</p>
            </div>
            <p className="color-brown">
              <strong>Data de cadastro:</strong> {new Date(equitador.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="primary"
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              {isEditing ? 'Cancelar' : 'Editar informações'}
            </Button>
            <Button
              variant="danger"
              onClick={handleArchive}
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
              Arquivar Profissional
            </Button>
          </div>
        </Col>
      </Row>

      <div className="btn-container">
        <div
          className={`title-div-adm ${conteudoAtivo === 'dadosPessoais' ? 'active-btn' : ''}`}
          onClick={() => setConteudoAtivo('dadosPessoais')}
          style={{ cursor: 'pointer' }}>
          Dados Pessoais
        </div>

        <div
          className={`title-div-adm ${conteudoAtivo === 'equinosCadastrados' ? 'active-btn' : ''}`}
          onClick={() => setConteudoAtivo('equinosCadastrados')}
          style={{ cursor: 'pointer' }}>
          Equinos Cadastrados
        </div>
      </div>

      <div className="mt-5">
        {conteudoAtivo === 'dadosPessoais' ? (
          isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <h5 className="title-adm mb-4">Dados de Identificação</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">
                        {validationErrors.name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sexo</label>
                    <select
                      className={`form-control ${validationErrors.gender ? 'is-invalid' : ''}`}
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="O">Outro</option>
                    </select>
                    {validationErrors.gender && (
                      <div className="invalid-feedback">
                        {validationErrors.gender}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CPF</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.cpf ? 'is-invalid' : ''}`}
                      name="cpf"
                      value={formData.cpf || ''}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />
                    {validationErrors.cpf && (
                      <div className="invalid-feedback">
                        {validationErrors.cpf}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">
                        {validationErrors.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="(00) 0 0000-0000"
                      required
                    />
                    {validationErrors.phone && (
                      <div className="invalid-feedback">
                        {validationErrors.phone}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className={`form-control ${validationErrors.birthDate ? 'is-invalid' : ''}`}
                      name="birthDate"
                      value={formData.birthDate || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.birthDate && (
                      <div className="invalid-feedback">
                        {validationErrors.birthDate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Endereço</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.address && (
                      <div className="invalid-feedback">
                        {validationErrors.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h5 className="title-adm mb-4">Dados Profissionais</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Formação</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.formation ? 'is-invalid' : ''}`}
                      name="formation"
                      value={formData.formation || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.formation && (
                      <div className="invalid-feedback">
                        {validationErrors.formation}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data de Conclusão</label>
                    <input
                      type="date"
                      className={`form-control ${validationErrors.formationDate ? 'is-invalid' : ''}`}
                      name="formationDate"
                      value={formData.formationDate || ''}
                      onChange={handleChange}
                      required
                    />
                    {validationErrors.formationDate && (
                      <div className="invalid-feedback">
                        {validationErrors.formationDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="secondary" 
                  className="me-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
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
                  Salvar Alterações
                </Button>
              </div>
            </form>
          ) : (
            renderDadosPessoais()
          )
        ) : (
          <div>
            <h5 className="title-adm mb-4">Equinos Cadastrados</h5>
            {equinos.length === 0 ? (
              <Alert variant="info">
                Nenhum equino cadastrado.
              </Alert>
            ) : (
              renderEquinosCadastrados(equinos)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DadosEquitadorAdm;
