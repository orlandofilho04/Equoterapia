import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CadastroProfissional.css';

const CadastroEquitador = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="cadastro-title mb-4">
        Cadastre um novo profissional
      </div>

      <Form className="cadastro-form">
        {/* Tipo de Profissional */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Selecione o tipo de profissional</Form.Label>
              <Form.Select className="input-field">
                <option value="">Equitador</option>
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
                placeholder="Digite o nome do Profissional"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label>Sexo</Form.Label>
              <Form.Select className="input-field">
                <option>Selecione o sexo</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={3} className="d-flex align-items-end">
            <div className="foto-placeholder">
              <span className="add-photo">+</span>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>CPF</Form.Label>
              <Form.Control 
                type="text"
                placeholder="000.000.000-00"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Endereço de email</Form.Label>
              <Form.Control 
                type="email"
                placeholder="Digite o Email do profissional"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control 
                type="text"
                placeholder="00/00/00"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Endereço</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Digite o endereço do praticante"
                className="input-field"
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
                placeholder="(00) 0 0000-0000"
                className="input-field"
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
                placeholder="Digite a formação do equitador"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Data de conclusão</Form.Label>
              <Form.Control 
                type="text"
                placeholder="00/00/00"
                className="input-field"
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
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="btn-concluir"
            >
              Concluir novo cadastro
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CadastroEquitador;