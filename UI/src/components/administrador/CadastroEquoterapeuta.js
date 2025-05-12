import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './CadastroProfissionalForm.css';
import { FaUserPlus, FaIdCard, FaGraduationCap } from 'react-icons/fa';

// Função para aplicar máscara de CPF
const applyMaskCPF = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const cpf = numbers.slice(0, 11);
  
  // Aplica a máscara
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }
};

// Função para aplicar máscara de telefone
const applyMaskPhone = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const phone = numbers.slice(0, 11);
  
  // Aplica a máscara
  if (phone.length <= 2) {
    return `(${phone}`;
  } else if (phone.length <= 3) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  } else if (phone.length <= 7) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3)}`;
  } else {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 7)}-${phone.slice(7)}`;
  }
};

const CadastroEquoterapeuta = () => {
  const navigate = useNavigate();
  
  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar autenticado para cadastrar profissionais.');
      navigate('/login');
    }
  }, [navigate]);

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
    andeTraining: false,
    photo: null,
    password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validatingCpf, setValidatingCpf] = useState(false);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [cpfError, setCpfError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const validateCpf = async (cpf) => {
    if (!cpf || cpf.replace(/[^0-9]/g, '').length !== 11) return;
    
    setValidatingCpf(true);
    setCpfError(null);
    
    try {
      // Como o endpoint não existe, fazemos uma validação local
      // Verificamos se o CPF tem formato válido (já validamos o comprimento acima)
      const cpfClean = cpf.replace(/[^0-9]/g, '');
      
      // Verificação básica de CPF (poderíamos adicionar algoritmo completo de validação)
      if (!/^\d{11}$/.test(cpfClean) || /^(\d)\1{10}$/.test(cpfClean)) {
        setCpfError('CPF inválido');
      }
      
      // No futuro, quando o endpoint existir:
      // const response = await api.get(`/professional/check-cpf/${cpfClean}`);
      // if (response.data.exists) {
      //   setCpfError('Este CPF já está cadastrado no sistema.');
      // }
    } catch (err) {
      console.error('Erro ao validar CPF:', err);
    } finally {
      setValidatingCpf(false);
    }
  };

  const validateEmail = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setValidatingEmail(true);
    setEmailError(null);
    
    try {
      // Validação local de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Formato de email inválido');
      }
      
      // No futuro, quando o endpoint existir:
      // const response = await api.get(`/professional/check-email/${email}`);
      // if (response.data.exists) {
      //   setEmailError('Este email já está cadastrado no sistema.');
      // }
    } catch (err) {
      console.error('Erro ao validar email:', err);
    } finally {
      setValidatingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

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
        photo: files[0]
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Para datas, faça uma validação especial
      if (name === 'birthDate' && value) {
        const dateObj = new Date(value);
        // Verificar se é uma data válida
        if (isNaN(dateObj.getTime())) {
          setError('Por favor, insira uma data de nascimento válida');
          return;
        }
        
        // Verificar se está dentro do intervalo razoável
        const currentYear = new Date().getFullYear();
        if (dateObj.getFullYear() < 1920 || dateObj.getFullYear() > currentYear) {
          setError(`A data de nascimento deve estar entre 1920 e ${currentYear}`);
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Para CPF e telefone, validamos após a entrada
      if (name === 'cpf' && value.replace(/[^0-9]/g, '').length === 11) {
        validateCpf(value);
      } else if (name === 'email' && value.includes('@')) {
        validateEmail(value);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf' && value.replace(/[^0-9]/g, '').length === 11) {
      validateCpf(value);
    } else if (name === 'email' && value.includes('@')) {
      validateEmail(value);
    }
  };

  // Função para lidar com campos mascarados
  const handleMaskedInput = (e, maskFunction) => {
    const { name, value } = e.target;
    
    // Aplica a máscara e atualiza o campo
    const maskedValue = maskFunction(value);
    e.target.value = maskedValue;
    
    // Atualiza o estado do formulário com o valor mascarado
    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
  };

  // Função de validação do formulário
  const validateForm = () => {
    // Reset error states
    setError(null);
    setCpfError(null);
    setEmailError(null);
    
    // Don't proceed if there are validation errors
    if (cpfError || emailError) {
      setError('Por favor, corrija os erros de validação antes de continuar.');
      return false;
    }

    // Basic form validation
    if (!formData.name || !formData.gender || !formData.cpf || !formData.email || 
        !formData.birthDate || !formData.address || !formData.phone || 
        !formData.formation) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    // Verificar se a data de nascimento não é futura
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    
    // Remover horas, minutos e segundos para comparação apenas de datas
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (birthDate > today) {
      setError('A data de nascimento não pode ser no futuro. Por favor, selecione uma data válida.');
      return false;
    }

    // Verificar se a data está em um intervalo razoável
    const minYear = 1920;
    const currentYear = today.getFullYear();
    if (birthDate.getFullYear() < minYear || birthDate.getFullYear() > currentYear) {
      setError(`A data de nascimento deve estar entre ${minYear} e ${currentYear}.`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, informe um email válido.');
      setEmailError('Email inválido');
      return false;
    }

    // Generate a password if one isn't already set
    if (!formData.password) {
      const tempPassword = Math.random().toString(36).slice(-8);
      setFormData(prev => ({ ...prev, password: tempPassword }));
      console.log('Senha temporária gerada:', tempPassword);
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Verificação e formatação correta da data de nascimento
      let birthDateFormatted = null;
      
      if (formData.birthDate) {
        const dateObj = new Date(formData.birthDate);
        
        // Verificar se a data é válida
        if (isNaN(dateObj.getTime())) {
          setError('Por favor, insira uma data de nascimento válida');
          setLoading(false);
          return;
        }
        
        // Verificar se a data não é futura
        const today = new Date();
        
        // Remover horas, minutos e segundos para comparação apenas de datas
        dateObj.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        if (dateObj > today) {
          setError('A data de nascimento não pode ser no futuro. Por favor, corrija antes de prosseguir.');
          setLoading(false);
          return;
        }
        
        // Se passarmos aqui, a data é válida e no passado
        // Formato ISO YYYY-MM-DD para envio à API
        birthDateFormatted = dateObj.toISOString().split('T')[0];
      }

      // Preparar apenas os dados que o backend aceita
      const registerData = {
        name: formData.name,
        username: formData.email.split('@')[0], // Criar um username a partir do email
        birthDate: birthDateFormatted,
        password: formData.password,
        role: null, // Será definido abaixo
        cpf: formData.cpf.replace(/[.-]/g, ''), // Remover pontos e traços do CPF
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        regNumber: formData.email.split('@')[0] + "-" + Math.floor(Math.random() * 1000) // Criar um número de registro temporário
      };

      // Mapear o valor do formation para o enum de role correto do backend
      switch (formData.formation) {
        case "Fisioterapeuta - COFFITO":
          registerData.role = "FISIOTERAPEUTA_COFFITO";
          break;
        case "Fonoaudiólogo - CREFONO":
          registerData.role = "FONOAUDIOLOGO_CREFONO";
          break;
        case "Psicólogo - CRP":
          registerData.role = "PSICOLOGO_CRP";
          break;
        case "Psicopedagogo - CFEP":
          registerData.role = "PSICOPEDAGOGO_CFEP";
          break;
        case "Terapeuta Ocupacional - COFFITO":
          registerData.role = "TERAPEUTA_OCUPACIONAL_COFFITO";
          break;
        case "Educador Físico - CREF":
          registerData.role = "EDUCADOR_FISICO_CREF";
          break;
        case "Assistente Social - CFESS":
          registerData.role = "ASSISTENTE_SOCIAL_CFESS";
          break;
        case "Pedagogo":
          registerData.role = "PEDAGOGO";
          break;
        default:
          registerData.role = "FISIOTERAPEUTA";
          break;
      }

      // Logar os dados que serão enviados
      console.log('Dados a serem enviados para registro:', JSON.stringify(registerData, null, 2));
      
      // Obter token de autenticação
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar autenticado para cadastrar profissionais.');
        setLoading(false);
        return;
      }
      
      try {
        // IMPORTANTE: Usar SOMENTE o endpoint /auth/register que é o único permitido pela configuração de segurança
        console.log('Tentando cadastrar usando o endpoint /auth/register');
        const registerResponse = await api.post('/auth/register', registerData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Resposta do registro:', registerResponse.data || registerResponse.status);

        // Verificar se o cadastro foi bem-sucedido pela resposta ou código de status
        if (registerResponse.status === 200 || registerResponse.status === 201) {
          console.log('Cadastro bem-sucedido!');
          setSuccess(true);
          
          // Como o backend não retorna o ID, precisamos buscar o profissional para continuar o fluxo
          try {
            // Buscar profissional pelo CPF/username para obter o ID
            const cpfLimpo = registerData.cpf.replace(/\D/g, '');
            const searchResponse = await api.get(`/professional?username=${registerData.username}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (searchResponse.data && searchResponse.data.id) {
              const newProfessionalId = searchResponse.data.id;
              
              // Se houver foto, enviar separadamente
              if (formData.photo) {
                try {
                  const photoFormData = new FormData();
                  photoFormData.append('photo', formData.photo);
                  
                  await api.put(`/professional/${newProfessionalId}/photo`, photoFormData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  console.log('Foto enviada com sucesso!');
                } catch (photoError) {
                  console.warn('Erro ao enviar foto:', photoError);
                }
              }
              
              alert('Profissional cadastrado com sucesso!');
              setTimeout(() => {
                navigate(`/dados-profissional-adm/${newProfessionalId}`);
              }, 500);
            } else {
              alert('Profissional cadastrado com sucesso!');
              setTimeout(() => {
                navigate('/listar-funcionarios-ativos');
              }, 1000);
            }
          } catch (searchError) {
            console.warn('Não foi possível localizar o profissional após cadastro:', searchError);
            alert('Profissional cadastrado com sucesso!');
            setTimeout(() => {
              navigate('/listar-funcionarios-ativos');
            }, 1000);
          }
        }
      } catch (apiError) {
        console.error('Erro detalhado na API:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
          method: apiError.config?.method,
          url: apiError.config?.url,
        });
        
        // Tratamento específico para erro de CORS
        if (apiError.message && apiError.message.includes('Network Error')) {
          setError(`Erro de rede: O servidor não está configurado para aceitar requisições do frontend (CORS). 
                   Verifique se o backend está funcionando e configurado corretamente.`);
        }
        // Tratar o erro 403 Forbidden
        else if (apiError.response?.status === 403) {
          setError(`Erro 403 - Acesso Negado: Você não tem permissão para cadastrar profissionais ou sua sessão expirou.
                   Tente fazer login novamente ou verifique as permissões da sua conta.`);
          console.log("Token atual:", localStorage.getItem('token'));
        }
        // Handle specific API errors
        else if (apiError.response?.data?.message?.includes('CPF already exists')) {
          setCpfError('Este CPF já está cadastrado no sistema.');
          setError('CPF já cadastrado. Por favor, verifique.');
        } else if (apiError.response?.data?.message?.includes('Email already exists')) {
          setEmailError('Este email já está cadastrado no sistema.');
          setError('Email já cadastrado. Por favor, verifique.');
        } else if (apiError.response?.data?.message?.includes('username') || apiError.response?.data?.detail?.includes('username')) {
          setError('Nome de usuário já existe ou é inválido. Tente outro email.');
        } else {
          const errorMessage = apiError.response?.data?.message || apiError.response?.data?.detail || 'Erro ao cadastrar profissional. Por favor, tente novamente.';
          setError(`Erro (${apiError.response?.status || 'desconhecido'}): ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error('Erro ao cadastrar profissional:', err);
      // Se a mensagem de erro ainda não foi definida nos blocos acima
      if (!error) {
        setError('Ocorreu um erro ao cadastrar o profissional. Verifique sua conexão com a internet e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-white border-0 pt-4 pb-0">
          <h2 className="mb-1" style={{ color: '#9B2D20', fontWeight: 'bold' }}>
            <FaUserPlus className="me-2" /> Cadastre um novo equoterapeuta
      </h2>
          <p className="text-muted mb-0">Preencha os dados para cadastrar um novo equoterapeuta no sistema</p>
        </div>

        <div className="card-body p-4">
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
              <i className="bi bi-check-circle-fill me-2"></i>
          Profissional cadastrado com sucesso! Redirecionando...
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
            <div className="form-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <FaIdCard className="me-2" style={{ color: '#9B2D20' }} />
                <h5 className="mb-0 fw-bold" style={{ color: '#343a40' }}>Dados de Identificação</h5>
              </div>
              <div className="bg-light p-4 rounded-3">
        <Row className="mb-4 align-items-end">
          <Col md={4}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Nome do Profissional</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome do Profissional"
                        className="form-control-lg"
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Sexo</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                        className="form-select-lg"
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              >
                <option value="">Selecione o sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4} className="text-center">
                    <div className="position-relative mx-auto" 
                         style={{ width: '130px', marginBottom: '10px' }}>
            <div style={{ 
                        width: '120px', 
                        height: '120px', 
              borderRadius: '50%', 
                        backgroundColor: '#f8f9fa', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto',
              cursor: 'pointer',
              overflow: 'hidden',
                        border: '2px solid #e9ecef',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }} onClick={() => document.getElementById('photo-upload').click()}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center">
                <span style={{ 
                              fontSize: '2.5rem', 
                  color: '#9B2D20',
                              lineHeight: '1'
                }}>+</span>
                            <small className="text-muted mt-1 px-2 text-center" style={{ fontSize: '0.7rem' }}>Adicionar foto</small>
                          </div>
              )}
              <input
                type="file"
                id="photo-upload"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
                      </div>
            </div>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
                onKeyUp={(e) => handleMaskedInput(e, applyMaskCPF)}
                onBlur={handleBlur}
                placeholder="000.000.000-00"
                className={`form-control-lg ${cpfError ? 'is-invalid' : ''}`}
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
              {validatingCpf && <small className="text-muted">Validando CPF...</small>}
              {cpfError && <div className="invalid-feedback">{cpfError}</div>}
            </Form.Group>
          </Col>
          
          <Col md={8}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Endereço de email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Digite o Email do profissional"
                        className={`form-control-lg ${emailError ? 'is-invalid' : ''}`}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
              {validatingEmail && <small className="text-muted">Validando email...</small>}
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </Form.Group>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                        className="form-control-lg"
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                        min="1920-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        onBlur={(e) => {
                          // Verificação adicional para garantir que a data não é futura
                          const selectedDate = new Date(e.target.value);
                          const today = new Date();
                          
                          // Remover as horas para comparação apenas da data
                          selectedDate.setHours(0, 0, 0, 0);
                          today.setHours(0, 0, 0, 0);
                          
                          if (selectedDate > today) {
                            setError('A data de nascimento não pode ser no futuro.');
                            // Resetar para o dia atual ou limpar o campo
                            setFormData(prev => ({...prev, birthDate: today.toISOString().split('T')[0]}));
                          }
                        }}
              />
              <small className="text-muted">A data deve estar entre 1920 e o dia atual</small>
            </Form.Group>
          </Col>
          
          <Col md={8}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Endereço</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Digite o endereço do profissional"
                        className="form-control-lg"
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </Form.Group>
          </Col>
        </Row>
        
                <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Telefone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                onKeyUp={(e) => handleMaskedInput(e, applyMaskPhone)}
                placeholder="(00) 0 0000-0000"
                className="form-control-lg"
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </Form.Group>
          </Col>
        </Row>
              </div>
            </div>
            
            <div className="form-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <FaGraduationCap className="me-2" style={{ color: '#9B2D20' }} />
                <h5 className="mb-0 fw-bold" style={{ color: '#343a40' }}>Dados da Área de Atuação</h5>
              </div>
              <div className="bg-light p-4 rounded-3">
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Registro Profissional</Form.Label>
              <Form.Select
                name="formation"
                value={formData.formation}
                onChange={handleChange}
                        className="form-select-lg"
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
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
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Realizou o curso da ANDE-BRASIL</Form.Label>
                      <div className="d-flex mt-3">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                  type="radio"
                  name="andeTraining"
                  id="andeTraining-yes"
                  checked={formData.andeTraining === true}
                  onChange={() => setFormData({...formData, andeTraining: true})}
                            style={{ width: '20px', height: '20px' }}
                          />
                          <label className="form-check-label ms-1 fw-medium" htmlFor="andeTraining-yes">
                            Sim
                          </label>
                        </div>
                        <div className="form-check form-check-inline ms-4">
                          <input
                            className="form-check-input"
                  type="radio"
                  name="andeTraining"
                  id="andeTraining-no"
                  checked={formData.andeTraining === false}
                  onChange={() => setFormData({...formData, andeTraining: false})}
                            style={{ width: '20px', height: '20px' }}
                />
                          <label className="form-check-label ms-1 fw-medium" htmlFor="andeTraining-no">
                            Não
                          </label>
                        </div>
              </div>
              <small className="form-text text-muted">Esta informação será apenas armazenada localmente, pois o backend não suporta este campo atualmente.</small>
            </Form.Group>
          </Col>
        </Row>
              </div>
            </div>
        
        <div className="d-flex justify-content-end mt-5">
          <Button 
                variant="outline-secondary" 
            className="me-3"
            onClick={() => navigate('/listar-funcionarios-ativos')}
                style={{ borderRadius: '8px', padding: '12px 24px', fontSize: '16px' }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading || cpfError || emailError}
                style={{ 
                  borderRadius: '8px', 
                  padding: '12px 24px', 
                  backgroundColor: '#9B2D20', 
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processando...
              </>
            ) : (
              'Concluir novo cadastro'
            )}
          </Button>
        </div>
      </Form>
        </div>
      </div>
    </div>
  );
};

export default CadastroEquoterapeuta;