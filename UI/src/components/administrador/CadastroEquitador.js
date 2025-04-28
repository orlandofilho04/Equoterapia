import React, { useState } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './CadastroProfissional.css';

const CadastroEquitador = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    cpf: '',
    email: '',
    birthDate: '',
    address: '',
    phone: '',
    role: 'equitador',
    formation: '',
    formationDate: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      navigate('/listar-funcionarios-ativos');
    } catch (err) {
      setError('Erro ao cadastrar equitador. Por favor, tente novamente.');
      console.error('Erro ao cadastrar equitador:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="cadastro-title mb-4">
        Cadastre um novo profissional
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
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
                className="input-field"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label>Sexo</Form.Label>
              <Form.Select 
                className="input-field"
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
                {formData.photo ? '✓' : '+'}
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
                className="input-field"
                required
              />
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
                className="input-field"
                required
              />
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
                className="input-field"
                required
              />
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
                className="input-field"
                required
              />
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
                className="input-field"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Dados da área de Atuação */}
        <div className="section-title">Dados da área de Atuação</div>
        <Row className="mb-4">
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Formação</Form.Label>
              <Form.Control 
                type="text"
                name="formation"
                value={formData.formation}
                onChange={handleChange}
                placeholder="Digite a formação do equitador"
                className="input-field"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Data de conclusão</Form.Label>
              <Form.Control 
                type="date"
                name="formationDate"
                value={formData.formationDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="d-flex justify-content-end gap-3">
            <Button 
              variant="secondary" 
              className="btn-cancelar"
              onClick={() => navigate(-1)}
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
              {loading ? 'Cadastrando...' : 'Concluir novo cadastro'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CadastroEquitador;