import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './CadastroPraticante1.css';
import { Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import api from '../../services/api';

const CadastroPraticante1 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showAnamnesisModal, setShowAnamnesisModal] = useState(false);
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPacient({ ...pacient, photo: file });
  };
  const [pacient, setPacient] = useState({
    name: 'Lucas Martins',
    scholarClass: 'Jardim II',
    schoolYear: 0,
    schoolModality: 1,
    schoolName: 'Escola Infantil Doce Saber',
    schoolShift: 'Manhã',
    avaliationDate: '2025-01-20',
    susNumber: '987000123456789',
    address: 'Rua das Acácias, 321, Belo Horizonte, MG',
    motherName: 'Juliana Martins',
    fatherName: 'Roberto Martins',
    workAddress: 'Avenida Afonso Pena, 500, Belo Horizonte, MG',
    phoneNumber: '31988776655',
    caregiverName: 'Juliana Martins',
    clinicDiagnosis: 'Transtorno do Espectro Autista (TEA)',
    birthDate: '2012-11-05',
    photo: 'url_foto_lucas.jpg',
    gender: 'M',
    status: 'ATIVO',
    observation: 'Paciente não verbal.',
    familyIncome: '8500.00'
  });
  const [legallyResponsibles, setLegallyResponsibles] = useState([{
    name: 'Juliana Martins',
    cpf: '123.456.789-10',
    gender: 'F',
    relationship: 'Mãe',
    phoneNumber: '31988776655',
    birthDate: '1980-05-20'
  }, {
    name: 'Roberto Martins',
    cpf: '109.876.543-21',
    gender: 'M',
    relationship: 'Pai',
    phoneNumber: '31999887766',
    birthDate: '1975-08-15'
  }]);
  const [anamnesis, setAnamnesis] = useState({
    reasonEvaluation: 'Avaliação inicial para equoterapia.',
    currentIllnessHistory: 'Diagnóstico de TEA aos 3 anos. Apresenta dificuldades de interação social e comunicação.',
    pastMedicalHistory: 'Nascido de parto normal, sem intercorrências. Calendário vacinal em dia.',
    familiarHistory: 'Sem histórico familiar relevante.',
    observation: 'Sensibilidade a ruídos altos.'
  });
  const [currentAge, setCurrentAge] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const token = localStorage.getItem('token');

  const handleResponsibleChange = (index, field, value) => {
    setLegallyResponsibles((prev) => {
      const updated = [...prev]; // copia o array
      updated[index] = { ...updated[index], [field]: value }; // atualiza só o campo desejado
      return updated;
    });
  };

  useEffect(() => {
    if (pacient.birthDate) {
      const today = new Date();
      const birth = new Date(pacient.birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();

      // Ajusta se ainda não fez aniversário esse ano
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      setCurrentAge(age);
    }
  }, [pacient.birthDate]);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // Adiciona um novo responsável
  const addResponsible = () => {
    setLegallyResponsibles(prev => [...prev, { name: '', cpf: '', gender: '' }]);
  };

  // Remove um responsável pelo índice
  const removeResponsible = (index) => {
    setLegallyResponsibles(prev => prev.filter((_, i) => i !== index));
  };

    const handleCadastro = async (event) => {
            event.preventDefault();

            const cadastroData = {
              name: pacient.name,
              scholarClass: pacient.scholarClass,
              schoolYear: pacient.schoolYear,
              schoolModality: pacient.schoolModality,
              schoolName: pacient.schoolName,
              schoolShift: pacient.schoolShift,
              avaliationDate: pacient.avaliationDate,
              susNumber: pacient.susNumber,
              address: pacient.address,
              motherName: pacient.motherName,
              fatherName: pacient.fatherName,
              workAddress: pacient.workAddress,
              phoneNumber: pacient.phoneNumber,
              caregiverName: pacient.caregiverName,
              clinicDiagnosis: pacient.clinicDiagnosis,
              birthDate: pacient.birthDate,
              photo: pacient.photo,
              gender: pacient.gender,
              status: pacient.status,
              observation: pacient.observation,
              familyIncome: pacient.familyIncome,
              anamnesis: {
                reasonEvaluation: anamnesis.reasonEvaluation,
                currentIllnessHistory: anamnesis.currentIllnessHistory,
                pastMedicalHistory: anamnesis.pastMedicalHistory,
                familiarHistory: anamnesis.familiarHistory,
                observation: anamnesis.observation
              },
              legallyResponsibles: legallyResponsibles.map(resp => ({
                name: resp.name,
                cpf: resp.cpf,
                gender: resp.gender
              }))
            };
    
            setIsSubmitting(true);
    
            try {
                await api.post(
                    `/pacients`,
                    cadastroData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
    
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/listar-praticantes');
                }, 2000);
            } catch (error) {
                console.error("Erro ao cadastrar praticante:", error);
                setShowError(true);
            } finally {
                setIsSubmitting(false);
            }
        };

  return (
    <div className="container my-5">
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
                          bg="success"
                          onClose={() => setShowSuccess(false)}
                          show={showSuccess}
                          delay={2000}
                          autohide
                      >
                          <Toast.Body className="text-white text-center">Praticante cadastrado com sucesso!</Toast.Body>
                      </Toast>
      
                      <Toast
                          bg="danger"
                          onClose={() => setShowError(false)}
                          show={showError}
                          delay={3000}
                          autohide
                      >
                          <Toast.Body className="text-white text-center">Erro ao cadastrar praticante. Verifique os campos.</Toast.Body>
                      </Toast>
      </ToastContainer>
      <Form className="cadastro-form" onSubmit={handleCadastro}>
        {step === 1 && (
          <>
          <div className="cadastroPraticante-title mb-4">
            Cadastre um novo praticante
          </div>

            {/* Nome do Praticante e Foto */}
            <Row className="mb-4">
              <Col xs={12} md={8}>
                <Form.Group>
                  <Form.Label>Nome do Praticante</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Digite o nome completo do praticante"
                    className="input-field"
                    value={pacient.name}
                    onChange={(e) => setPacient({ ...pacient, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} className="d-flex align-items-center justify-content-start">
                <div className="foto-placeholder">
                  <label htmlFor="photo-upload" className="foto-label">
                    {pacient.photo ? (
                      <img 
                        //src={URL.createObjectURL(pacient.photo)} 
                        alt="Foto do Praticante" 
                        className="foto-preview"
                      />
                    ) : (
                      <div className="plus-icon">+</div>
                    )}
                  </label>

                  {/* input nativo (não o Form.Control) */}
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
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
                    value={pacient.scholarClass}
                    onChange={(e) => setPacient({ ...pacient, scholarClass: e.target.value })}
                    required
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
                    value={pacient.schoolYear}
                    onChange={(e) => setPacient({ ...pacient, schoolYear: e.target.value })}
                    required
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
                    value={pacient.schoolModality}
                    onChange={(e) => setPacient({ ...pacient, schoolModality: e.target.value })}
                    required
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
                    value={pacient.schoolName}
                    onChange={(e) => setPacient({ ...pacient, schoolName: e.target.value })}
                    required
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
                    value={pacient.schoolShift}
                    onChange={(e) => setPacient({ ...pacient, schoolShift: e.target.value })}
                    required
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
                    type="date" 
                    className="input-field"
                    value={pacient.avaliationDate}
                    onChange={(e) => setPacient({ ...pacient, avaliationDate: e.target.value })}
                    required
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
                    value={pacient.susNumber}
                    onChange={(e) => setPacient({ ...pacient, susNumber: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select className="input-field" value={pacient.gender} onChange={(e) => setPacient({ ...pacient, gender: e.target.value })} required>
                    <option>Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="input-field"
                    value={pacient.birthDate}
                    onChange={(e) => setPacient({ ...pacient, birthDate: e.target.value })}
                    required
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
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    required
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
                    value={pacient.address}
                    onChange={(e) => setPacient({ ...pacient, address: e.target.value })}
                    required
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
                    value={pacient.fatherName}
                    onChange={(e) => setPacient({ ...pacient, fatherName: e.target.value })}
                    required
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
                    value={pacient.motherName}
                    onChange={(e) => setPacient({ ...pacient, motherName: e.target.value })}
                    required
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
                    value={pacient.workAddress}
                    onChange={(e) => setPacient({ ...pacient, workAddress: e.target.value })}
                    required
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
                    value={pacient.phoneNumber}
                    onChange={(e) => setPacient({ ...pacient, phoneNumber: e.target.value })}
                    required
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
                    value={pacient.caregiverName}
                    onChange={(e) => setPacient({ ...pacient, caregiverName: e.target.value })}
                    required
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
                    value={pacient.clinicDiagnosis}
                    onChange={(e) => setPacient({ ...pacient, clinicDiagnosis: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Responsáveis pelo Praticante */}
            <div className="sectionPraticante-title">
              Responsáveis pelo Praticante
              {legallyResponsibles.map((resp, index) => (
                <div key={index} className="responsavel-wrapper mb-4">
                  <div className="text-muted mb-3">Responsável {index + 1}</div>

                  <Row className="mb-3">
                    <Col xs={12} md={4}>
                      <Form.Group>
                        <Form.Label>Grau de parentesco</Form.Label>
                        <Form.Select
                          className="input-field"
                          value={resp.relationship || ''}
                          onChange={e => handleResponsibleChange(index, 'relationship', e.target.value)}
                        >
                          <option value="">Selecione o grau de parentesco</option>
                          <option value="Pai">Pai</option>
                          <option value="Mãe">Mãe</option>
                          <option value="Outro">Outro</option>
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
                          value={resp.name || ''}
                          onChange={e => handleResponsibleChange(index, 'name', e.target.value)}
                          required
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
                          value={resp.cpf || ''}
                          onChange={e => handleResponsibleChange(index, 'cpf', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={12} md={4}>
                      <Form.Group>
                        <Form.Label>Data de Nascimento</Form.Label>
                        <Form.Control
                          type="date"
                          className="input-field"
                          value={resp.birthDate || ''}
                          onChange={e => handleResponsibleChange(index, 'birthDate', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                      <Form.Group>
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select
                          className="input-field"
                          value={resp.gender || ''}
                          onChange={e => handleResponsibleChange(index, 'gender', e.target.value)}
                          required
                        >
                          <option value="">Selecione o sexo</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
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
                          value={resp.phoneNumber || ''}
                          onChange={e => handleResponsibleChange(index, 'phoneNumber', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {legallyResponsibles.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeResponsible(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="secondary" onClick={addResponsible}>
                Adicionar outro responsável
              </Button>
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
                    value={pacient.observation}
                    onChange={(e) => setPacient({ ...pacient, observation: e.target.value })}
                    required
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
                    value={pacient.familyIncome}
                    onChange={(e) => setPacient({ ...pacient, familyIncome: e.target.value })}
                    required
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
                  onClick={() => setStep(2)}
                  >
                  Avançar
                </Button>
              </Col>
            </Row>
          </>
        )}
        {step === 2 && (
          <>
                <div className="cadastroPraticante-title mb-4">
                  Cadastre um novo praticante
                </div>

                  {/* Cronograma de atividade */}
                  <div className="sectionPraticante-title mb-4">
                    Cronograma de atividade do Praticante em outras instituições
                  </div>
          
                  <div className="schedule-table mb-4">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="bg-light">Turno/dia</th>
                            <th className="bg-light">Segunda</th>
                            <th className="bg-light">Terça</th>
                            <th className="bg-light">Quarta</th>
                            <th className="bg-light">Quinta</th>
                            <th className="bg-light">Sexta</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="bg-light">Matutino</td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                          </tr>
                          <tr>
                            <td className="bg-light">Vespertino</td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                            <td><Form.Check className="d-flex justify-content-center check-Praticante" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
          
                  <Row className="mb-4">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Observações</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          placeholder="Observação (horário desejado das sessões de Equoterapia)"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
          
                  {/* Em caso de emergência */}
                  <div className="sectionPraticante-title mb-4">Em caso de emergência</div>
                  
                  <Row className="mb-4">
                    <Col xs={12} md={8}>
                      <Form.Group>
                        <Form.Label>Ligar para</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Nome do responsável"
                          className="input-field"
                        />
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
          
                  <Row className="mb-4">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Plano de Saúde</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Digite o qual plano de saúde (opcional)"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
          
                  {/* Informações complementares */}
                  <div className="sectionPraticante-title mb-4">Informações complementares</div>
          
                  <Row className="mb-4">
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Data de Avaliação</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="00/00/00"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Previsão de Alta da Equoterápicas</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="00/00/00"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
          
                  <Row className="mb-4">
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Profissional responsável pela coleta de informações</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Nome do responsável"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Número de Registro</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Número de registro"
                          className="input-field"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Insira uma anamnese</Form.Label>
                        <Button 
                          variant="outline-primary" 
                          className="d-block mt-2"
                          onClick={() => setShowAnamnesisModal(true)}
                        >
                          Inserir Anamnese
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Modal para selecionar ou criar nova anamnese pode ser implementado aqui */}
                  <Modal
                    show={showAnamnesisModal}
                    onHide={() => setShowAnamnesisModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Inserir Anamnese</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {/* Conteúdo do modal */}
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label>Motivo da Avaliação</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Motivo da avaliação"
                              className="input-field"
                              value={anamnesis.reasonEvaluation}
                              onChange={(e) => setAnamnesis({ ...anamnesis, reasonEvaluation: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label>História da Doença Atual</Form.Label>
                            <Form.Control
                              as="textarea"
                              placeholder="História da doença atual"
                              className="input-field"
                              value={anamnesis.currentIllnessHistory}
                              onChange={(e) => setAnamnesis({ ...anamnesis, currentIllnessHistory: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Form.Group>
                              <Form.Label>Histórico médico passado</Form.Label>
                              <Form.Control
                                as="textarea"
                                placeholder="História médica passada"
                                className="input-field"
                                value={anamnesis.pastMedicalHistory}
                                onChange={(e) => setAnamnesis({ ...anamnesis, pastMedicalHistory: e.target.value })}
                              />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Form.Group>
                              <Form.Label>Histórico familiar</Form.Label>
                              <Form.Control
                                as="textarea"
                                placeholder="Histórico familiar"
                                className="input-field"
                                value={anamnesis.familiarHistory}
                                onChange={(e) => setAnamnesis({ ...anamnesis, familiarHistory: e.target.value })}
                              />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Form.Group>
                              <Form.Label>Observação</Form.Label>
                              <Form.Control
                                as="textarea"
                                placeholder="Observações adicionais"
                                className="input-field"
                                value={anamnesis.observation}
                                onChange={(e) => setAnamnesis({ ...anamnesis, observation: e.target.value })}
                              />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="btnP-concluir" variant="primary" onClick={() => setShowAnamnesisModal(false)}>
                        Concluir
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* Botões de ação */}
                  <Row className="mt-5">
                    <Col className="d-flex justify-content-end gap-3">
                      <Button 
                        variant="secondary" 
                        className="btnP-voltar"
                        onClick={() => setStep(1)}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        className="btnP-concluir" 
                        variant="primary" 
                        disabled={
                          isSubmitting
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Agendando...
                          </>
                          ) : (
                            'Concluir novo cadastro'
                        )}
                      </Button>
                    </Col>
                  </Row>
          </>
        )}
      </Form>
      </div>
  );
};

export default CadastroPraticante1;