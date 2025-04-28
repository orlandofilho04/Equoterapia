import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './CadastroProfissional.css';

const CadastroEquoterapeuta = ({ initialRole, onError, hideHeader = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    cpf: '',
    email: '',
    birthDate: '',
    address: '',
    phone: '',
    role: initialRole || 'equoterapeuta',
    professionalRegistry: '',
    andeCourse: 'sim'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialRole) {
      setFormData(prev => ({ ...prev, role: initialRole }));
    }
  }, [initialRole]);

  // Quando houver um erro e onError estiver definido, propague o erro para o componente pai
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

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
    }

    if (!formData.address.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Telefone inválido. Formato esperado: (00) 0 0000-0000';
    }

    if (!formData.professionalRegistry) {
      errors.professionalRegistry = 'Registro profissional é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
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
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
        if (value !== null && value !== undefined) formDataToSend.append(key, value);
      });

      await api.post('/professional', formDataToSend, {
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
    <div className={hideHeader ? "" : "container my-5"}>
      {!hideHeader && error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {!hideHeader && success && (
        <Alert variant="success" className="mb-4">
          Profissional cadastrado com sucesso! Redirecionando...
        </Alert>
      )}
      
      {!hideHeader && (
        <div className="cadastro-title mb-4">
          Cadastre um novo profissional
        </div>
      )}

      <Form className="cadastro-form" onSubmit={handleSubmit}>
        {/* Tipo de Profissional - só exibe se não estiver ocultando o cabeçalho */}
        {!hideHeader && (
          <Row className="mb-4">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Selecione o tipo de profissional</Form.Label>
                <Form.Select 
                  className="input-field"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="equoterapeuta">Equoterapeuta</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}

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
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Endereço de email</Form.Label>
              <Form.Control 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o Email do profissional"
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
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={4}>
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
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Endereço</Form.Label>
              <Form.Control 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Digite o endereço do profissional"
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

        <Row className="mb-4">
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

        {/* Dados da área de Atuação */}
        <div className="section-title">Dados da área de Atuação</div>
        <Row className="mb-4">
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Registro Profissional</Form.Label>
              <Form.Select 
                className={`input-field ${validationErrors.professionalRegistry ? 'is-invalid' : ''}`}
                name="professionalRegistry"
                value={formData.professionalRegistry}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o Registro Profissional</option>
                <option value="Fisioterapeuta">Fisioterapeuta - COFFITO</option>
                <option value="Fonoaudiólogo">Fonoaudiólogo - CREFONO</option>
                <option value="Psicólogo">Psicólogo - CRP</option>
                <option value="Psicopedagogo">Psicopedagogo - CFEP</option>
                <option value="Terapeuta Ocupacional">Terapeuta Ocupacional - COFFITO</option>
                <option value="Educador Físico">Educador Físico - CREF</option>
                <option value="Assistente Social">Assistente Social - CFESS</option>
                <option value="Pedagogo">Pedagogo</option>
              </Form.Select>
              {validationErrors.professionalRegistry && (
                <Form.Control.Feedback type="invalid">
                  {validationErrors.professionalRegistry}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-center">
            <Form.Group className="radio-group">
              <Form.Label>Realizou o curso da ANDE-BRASIL</Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  label="Sim"
                  name="andeCourse"
                  id="curso-sim"
                  value="sim"
                  onChange={handleChange}
                  className="custom-radio"
                  defaultChecked={formData.andeCourse === 'sim'}
                />
                <Form.Check
                  type="radio"
                  label="Não"
                  name="andeCourse"
                  id="curso-nao"
                  value="nao"
                  onChange={handleChange}
                  className="custom-radio"
                  defaultChecked={formData.andeCourse === 'nao'}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="d-flex justify-content-end gap-3">
            <Button 
              variant="secondary" 
              className="btn-cancelar"
              onClick={() => navigate('/listar-funcionarios-ativos')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="btn-concluir"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Concluir novo cadastro'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CadastroEquoterapeuta;