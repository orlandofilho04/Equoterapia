import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CadastroPraticante1.css';

const CadastroPraticante1 = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="cadastroPraticante-title mb-4">
        Cadastre um novo praticante
      </div>

      <Form className="cadastro-form">
        {/* Nome do Praticante e Foto */}
        <Row className="mb-4">
          <Col xs={12} md={8}>
            <Form.Group>
              <Form.Label>Nome do Praticante</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Digite o nome completo do praticante"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-start">
            <div className="foto-placeholder">
              <div className="plus-icon">+</div>
            </div>
          </Col>
        </Row>

        {/* Escolaridade */}
        <div className="sectionPraticante-title">Escolaridade</div>
        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Turma</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Em qual turma está matriculado(a)"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Ano/Série</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Em que ano/série escolar está matriculado(a)"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Modalidade Escolar</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Em qual a modalidade escolar está matriculado(a)"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Instituição de Ensino</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Em qual instituição de ensino está matriculado(a)"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Turno de Estudo</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Em qual período do dia está matriculado(a)"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Dados de Identificação */}
        <div className="sectionPraticante-title">Dados de Identificação</div>
        <Row className="mb-3">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Data de Avaliação</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="00/00/00"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Cartão SUS</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nº cartão SUS"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Sexo</Form.Label>
              <Form.Select className="input-field">
                <option>Selecione o sexo</option>
                <option>Masculino</option>
                <option>Feminino</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
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
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Idade Atual</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Considerando a data atual"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
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

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Nome do Pai</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Digite o nome do responsável"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Nome da Mãe</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Digite o nome do responsável"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Endereço do trabalho</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Digite o endereço de trabalho"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label>Telefone</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="(00) 0 0000-0000"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label>Cuidador</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Informe o nome do cuidador"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Diagnostico Clínico */}
        <div className="sectionPraticante-title">Diagnóstico Clínico</div>
        <Row className="mb-4">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Diagnóstico Clínico</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                placeholder="Digite o diagnóstico Clínico do praticante..."
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Responsáveis pelo Praticante */}
        <div className="sectionPraticante-title">Responsáveis pelo Praticante</div>
        
        {/* Responsável 1 */}
        <div className="responsavel-wrapper mb-4">
          <div className="text-muted mb-3">Responsável 1</div>
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Grau de parentesco</Form.Label>
                <Form.Select className="input-field">
                  <option>Selecione o grau de parentesco</option>
                  <option>Pai</option>
                  <option>Mãe</option>
                  <option>Outro</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Digite o nome completo"
                  className="input-field"
                />
              </Form.Group>
            </Col>
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
          </Row>

          <Row className="mb-3">
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
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select className="input-field">
                <option>Selecione o sexo</option>
                <option>Masculino</option>
                <option>Feminino</option>
              </Form.Select>
              </Form.Group>
            </Col>
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
        </div>

        {/* Responsável 2 */}
        <div className="responsavel-wrapper mb-4">
          <div className="text-muted mb-3">Responsável 2</div>
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Grau de parentesco</Form.Label>
                <Form.Select className="input-field">
                  <option>Selecione o grau de parentesco</option>
                  <option>Pai</option>
                  <option>Mãe</option>
                  <option>Outro</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Digite o nome completo"
                  className="input-field"
                />
              </Form.Group>
            </Col>
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
          </Row>

          <Row className="mb-3">
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
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select className="input-field">
                <option>Selecione o sexo</option>
                <option>Masculino</option>
                <option>Feminino</option>
              </Form.Select>
              </Form.Group>
            </Col>
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
        </div>

        <Row className="mb-4">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Observações</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                placeholder="Digite as observações dos responsáveis..."
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Renda Familiar R$</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Digite a renda"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-end gap-3">
            <Button 
              variant="secondary" 
              className="btn-cancelar"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
            <Button 
              variant="success" 
              className="btn-avancar"
              onClick={() => navigate('/cadastro-praticante/2')}
            >
              Avançar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CadastroPraticante1;