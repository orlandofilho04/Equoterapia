import React, { useState } from 'react';
import { Form, Row, Col, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './CadastroProfissional.css';

const CadastroProfissional1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    cpf: '',
    email: '',
    birthDate: '',
    address: '',
    phone: '',
    role: 'equoterapeuta',
    formation: '',
    formationDate: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const validateForm = () => {
    const errors = {};
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const phoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
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
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.birthDate = 'O profissional deve ter pelo menos 18 anos';
      }
    }

    if (!formData.address.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Telefone inválido. Formato esperado: (00) 0 0000-0000';
    }

    if (!formData.formation.trim()) {
      errors.formation = 'Formação é obrigatória';
    }

    if (!formData.formationDate) {
      errors.formationDate = 'Data de conclusão é obrigatória';
    } else {
      const formationDate = new Date(formData.formationDate);
      const today = new Date();
      if (formationDate > today) {
        errors.formationDate = 'Data de conclusão não pode ser futura';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('O arquivo deve ser uma imagem');
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
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

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      await api.post('/professionals', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/listar-funcionarios-ativos');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar profissional. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao cadastrar profissional:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Cadastre um novo profissional</h4>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              Profissional cadastrado com sucesso! Redirecionando...
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="cadastro-form">
            {/* Tipo de Profissional */}
            <Row className="mb-4">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Selecione o tipo de profissional</Form.Label>
                  <Form.Select 
                    className="input-field"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="equoterapeuta">Equoterapeuta</option>
                    <option value="equitador">Equitador</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Dados de Identificação */}
            <div className="section-title">Dados de Identificação</div>
            <Row className="mb-4">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Nome do Profissional</Form.Label>
                  <Form.Control 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite o nome do Profissional"
                    className={`input-field ${validationErrors.name ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.name && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group>
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select 
                    className={`input-field ${validationErrors.gender ? 'is-invalid' : ''}`}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </Form.Select>
                  {validationErrors.gender && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.gender}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={3} className="d-flex align-items-end">
                <div className="foto-placeholder">
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="add-photo">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="preview-image" />
                    ) : formData.photo ? (
                      '✓'
                    ) : (
                      '+'
                    )}
                  </label>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>CPF</Form.Label>
                  <Form.Control 
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className={`input-field ${validationErrors.cpf ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.cpf && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.cpf}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@email.com"
                    className={`input-field ${validationErrors.email ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.email && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 0 0000-0000"
                    className={`input-field ${validationErrors.phone ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.phone && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phone}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control 
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`input-field ${validationErrors.birthDate ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.birthDate && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.birthDate}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Digite o endereço completo"
                    className={`input-field ${validationErrors.address ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.address && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.address}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Dados Profissionais */}
            <div className="section-title">Dados Profissionais</div>
            <Row className="mb-4">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Formação</Form.Label>
                  <Form.Control 
                    type="text"
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    placeholder="Digite a formação do profissional"
                    className={`input-field ${validationErrors.formation ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.formation && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.formation}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Data de Conclusão</Form.Label>
                  <Form.Control 
                    type="date"
                    name="formationDate"
                    value={formData.formationDate}
                    onChange={handleChange}
                    className={`input-field ${validationErrors.formationDate ? 'is-invalid' : ''}`}
                    required
                  />
                  {validationErrors.formationDate && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.formationDate}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => navigate('/listar-funcionarios-ativos')}
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
                Cadastrar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CadastroProfissional1;