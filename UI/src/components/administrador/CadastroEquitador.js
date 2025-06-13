import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { api } from "../../services/api";
import "./CadastroProfissionalForm.css";
import { FaUserPlus, FaIdCard, FaGraduationCap, FaHorse } from "react-icons/fa";

const CadastroEquitador = () => {
  const navigate = useNavigate();

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para cadastrar profissionais.");
      navigate("/login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    cpf: "",
    email: "",
    birthDate: "",
    address: "",
    phone: "",
    role: "EQUITADOR",
    formation: "",
    formationDate: "",
    photo: null,
    password:
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8),
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
    if (!cpf || cpf.replace(/[^0-9]/g, "").length !== 11) return;

    setValidatingCpf(true);
    setCpfError(null);

    try {
      // Como o endpoint não existe, fazemos uma validação local
      // Verificamos se o CPF tem formato válido (já validamos o comprimento acima)
      const cpfClean = cpf.replace(/[^0-9]/g, "");

      // Verificação básica de CPF
      if (!/^\d{11}$/.test(cpfClean) || /^(\d)\1{10}$/.test(cpfClean)) {
        setCpfError("CPF inválido");
      }
    } catch (err) {
      console.error("Erro ao validar CPF:", err);
    } finally {
      setValidatingCpf(false);
    }
  };

  const validateEmail = async (email) => {
    if (!email || !email.includes("@")) return;

    setValidatingEmail(true);
    setEmailError(null);

    try {
      // Validação local de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Formato de email inválido");
      }
    } catch (err) {
      console.error("Erro ao validar email:", err);
    } finally {
      setValidatingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setError("A imagem deve ter no máximo 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("O arquivo deve ser uma imagem");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        photo: files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Para datas, faça uma validação especial
      if (name === "birthDate" && value) {
        const dateObj = new Date(value);
        // Verificar se é uma data válida
        if (isNaN(dateObj.getTime())) {
          setError("Por favor, insira uma data de nascimento válida");
          return;
        }

        // Verificar se está dentro do intervalo razoável
        const currentYear = new Date().getFullYear();
        if (
          dateObj.getFullYear() < 1920 ||
          dateObj.getFullYear() > currentYear
        ) {
          setError(
            `A data de nascimento deve estar entre 1920 e ${currentYear}`
          );
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate CPF and email on change
      if (name === "cpf" && value.replace(/[^0-9]/g, "").length === 11) {
        validateCpf(value);
      } else if (name === "email" && value.includes("@")) {
        validateEmail(value);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "cpf" && value.replace(/[^0-9]/g, "").length === 11) {
      validateCpf(value);
    } else if (name === "email" && value.includes("@")) {
      validateEmail(value);
    }
  };

  // Função de validação do formulário
  const validateForm = () => {
    // Reset error states
    setError(null);
    setCpfError(null);
    setEmailError(null);

    // Don't proceed if there are validation errors
    if (cpfError || emailError) {
      setError("Por favor, corrija os erros de validação antes de continuar.");
      return false;
    }

    // Basic form validation
    if (
      !formData.name ||
      !formData.gender ||
      !formData.cpf ||
      !formData.email ||
      !formData.birthDate ||
      !formData.address ||
      !formData.phone
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, informe um email válido.");
      setEmailError("Email inválido");
      return false;
    }

    // Generate a password if one isn't already set
    if (!formData.password) {
      const tempPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      setFormData((prev) => ({ ...prev, password: tempPassword }));
      console.log("Senha temporária gerada:", tempPassword);
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

        // Verificar se a data é válida (não é NaN e está em um ano razoável)
        if (
          isNaN(dateObj.getTime()) ||
          dateObj.getFullYear() < 1920 ||
          dateObj.getFullYear() > new Date().getFullYear()
        ) {
          setError("Por favor, insira uma data de nascimento válida");
          setLoading(false);
          return;
        }

        // Verificar se a data não é futura
        const today = new Date();

        // Remover horas, minutos e segundos para comparação apenas de datas
        dateObj.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (dateObj > today) {
          setError(
            "A data de nascimento não pode ser no futuro. Por favor, corrija antes de prosseguir."
          );
          setLoading(false);
          return;
        }

        // Formato ISO YYYY-MM-DD para envio à API
        birthDateFormatted = dateObj.toISOString().split("T")[0];
      }

      // Preparar apenas os dados que o backend aceita - usar formato completo que funciona no backend
      const registerData = {
        name: formData.name,
        username: formData.email.split("@")[0], // Criar um username a partir do email
        birthDate: birthDateFormatted,
        password: "12345678",
        role: "EQUITADOR", // Usar o enum correto
        cpf: formData.cpf.replace(/[.-]/g, ""),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        regNumber:
          formData.email.split("@")[0] + "-" + Math.floor(Math.random() * 1000),
      };

      // Logar os dados que serão enviados
      console.log(
        "Dados a serem enviados para registro:",
        JSON.stringify(registerData, null, 2)
      );

      // Obter token de autenticação
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "Você precisa estar autenticado para cadastrar profissionais."
        );
        setLoading(false);
        return;
      }

      try {
        // IMPORTANTE: Usar SOMENTE o endpoint /auth/register que é o único permitido pela configuração de segurança
        console.log("Tentando cadastrar usando o endpoint /auth/register");

        // Tentativa 1: Api padrão (axios) com dados completos
        try {
          console.log("Tentando cadastrar equitador com dados completos");
          const registerResponse = await api.post(
            "/auth/register",
            registerData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log(
            "Resposta do registro:",
            registerResponse.data || registerResponse.status
          );
          cadastroSucesso(registerResponse, token); // Usar token do escopo externo
        } catch (error) {
          console.error("Erro no cadastro:", error);
          throw error; // Repassar o erro para tratamento abaixo
        }
      } catch (apiError) {
        console.error("Erro detalhado na API:", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
          method: apiError.config?.method,
          url: apiError.config?.url,
          request: apiError.request,
        });

        // Tratamento específico para erro de CORS
        if (apiError.message && apiError.message.includes("Network Error")) {
          setError(`Erro de rede: O servidor não está configurado para aceitar requisições do frontend (CORS). 
                   Verifique se o backend está funcionando e configurado corretamente.`);
        }
        // Tratar o erro 403 Forbidden
        else if (apiError.response?.status === 403) {
          setError(`Erro 403 - Acesso Negado: Você não tem permissão para cadastrar equitadores ou sua sessão expirou.
                   Tente fazer login novamente ou verifique as permissões da sua conta.`);
          console.log("Token atual:", localStorage.getItem("token"));
        }
        // Handle specific API errors
        else if (
          apiError.response?.data?.message?.includes("CPF already exists")
        ) {
          setCpfError("Este CPF já está cadastrado no sistema.");
          setError("CPF já cadastrado. Por favor, verifique.");
        } else if (
          apiError.response?.data?.message?.includes("Email already exists")
        ) {
          setEmailError("Este email já está cadastrado no sistema.");
          setError("Email já cadastrado. Por favor, verifique.");
        } else if (
          apiError.response?.data?.message?.includes("username") ||
          apiError.response?.data?.detail?.includes("username")
        ) {
          setError(
            "Nome de usuário já existe ou é inválido. Tente outro email."
          );
        } else {
          const errorMessage =
            apiError.response?.data?.message ||
            apiError.response?.data?.detail ||
            "Erro ao cadastrar equitador. Por favor, tente novamente.";
          setError(
            `Erro (${
              apiError.response?.status || "desconhecido"
            }): ${errorMessage}`
          );
        }
      }
    } catch (err) {
      console.error("Erro ao cadastrar equitador:", err);
      setError("Erro ao processar o cadastro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para processar cadastro bem-sucedido
  function cadastroSucesso(response, authToken) {
    console.log("Cadastro bem-sucedido!");
    setSuccess(true);

    // Como o backend não retorna o ID, precisamos buscar o profissional para continuar o fluxo
    try {
      // Buscar profissional pelo username para obter o ID
      const searchUsername = formData.email.split("@")[0];
      api
        .get(`/professional?username=${searchUsername}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((searchResponse) => {
          if (searchResponse.data && searchResponse.data.id) {
            const newProfessionalId = searchResponse.data.id;

            // Se houver foto, enviar separadamente
            if (formData.photo) {
              const photoFormData = new FormData();
              photoFormData.append("photo", formData.photo);

              api
                .put(
                  `/professional/${newProfessionalId}/photo`,
                  photoFormData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${authToken}`,
                    },
                  }
                )
                .then(() => {
                  console.log("Foto enviada com sucesso!");
                })
                .catch((photoError) => {
                  console.warn("Erro ao enviar foto:", photoError);
                });
            }

            setSuccess(true);
            alert("Equitador cadastrado com sucesso!");
            setTimeout(() => {
              navigate(`/dados-profissional-adm/${newProfessionalId}`);
            }, 500);
          } else {
            // Cadastrado com sucesso, mas sem ID retornado
            console.log("Profissional cadastrado, mas ID não encontrado");
            setSuccess(true);
            alert("Equitador cadastrado com sucesso!");
            setTimeout(() => {
              navigate("/listar-funcionarios-ativos");
            }, 1000);
          }
        })
        .catch((searchError) => {
          console.warn(
            "Não foi possível localizar o profissional após cadastro:",
            searchError
          );
          setSuccess(true);
          alert("Equitador cadastrado com sucesso!");
          setTimeout(() => {
            navigate("/listar-funcionarios-ativos");
          }, 1000);
        });
    } catch (err) {
      console.warn("Erro ao buscar profissional:", err);
      setSuccess(true);
      alert("Equitador cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/listar-funcionarios-ativos");
      }, 1000);
    }
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-white border-0 pt-4 pb-0">
          <h2 className="mb-1" style={{ color: "#9B2D20", fontWeight: "bold" }}>
            <FaHorse className="me-2" /> Cadastre um novo equitador(a)
          </h2>
          <p className="text-muted mb-0">
            Preencha os dados para cadastrar um novo equitador no sistema
          </p>
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
                <FaIdCard className="me-2" style={{ color: "#9B2D20" }} />
                <h5 className="mb-0 fw-bold" style={{ color: "#343a40" }}>
                  Dados de Identificação
                </h5>
              </div>
              <div className="bg-light p-4 rounded-3">
                <Row className="mb-4 align-items-end">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        Nome do Profissional
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Digite o nome do Profissional"
                        className="form-control-lg"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
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
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="text-center">
                    <div
                      className="position-relative mx-auto"
                      style={{ width: "130px", marginBottom: "10px" }}
                    >
                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          cursor: "pointer",
                          overflow: "hidden",
                          border: "2px solid #e9ecef",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        onClick={() =>
                          document.getElementById("photo-upload").click()
                        }
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center">
                            <span
                              style={{
                                fontSize: "2.5rem",
                                color: "#9B2D20",
                                lineHeight: "1",
                              }}
                            >
                              +
                            </span>
                            <small
                              className="text-muted mt-1 px-2 text-center"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Adicionar foto
                            </small>
                          </div>
                        )}
                        <input
                          type="file"
                          id="photo-upload"
                          name="photo"
                          onChange={handleChange}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">CPF</Form.Label>
                      <InputMask
                        mask="999.999.999-99"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="000.000.000-00"
                        className={`form-control form-control-lg ${
                          cpfError ? "is-invalid" : ""
                        }`}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      />
                      {validatingCpf && (
                        <small className="text-muted">Validando CPF...</small>
                      )}
                      {cpfError && (
                        <div className="invalid-feedback">{cpfError}</div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        Endereço de email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Digite o Email do profissional"
                        className={`form-control-lg ${
                          emailError ? "is-invalid" : ""
                        }`}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      />
                      {validatingEmail && (
                        <small className="text-muted">Validando email...</small>
                      )}
                      {emailError && (
                        <div className="invalid-feedback">{emailError}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        Data de Nascimento
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="form-control-lg"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                        min="1920-01-01"
                        max={new Date().toISOString().split("T")[0]}
                      />
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
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Telefone</Form.Label>
                      <InputMask
                        mask="(99) 9 9999-9999"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(00) 0 0000-0000"
                        className="form-control form-control-lg"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="form-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <FaGraduationCap
                  className="me-2"
                  style={{ color: "#9B2D20" }}
                />
                <h5 className="mb-0 fw-bold" style={{ color: "#343a40" }}>
                  Dados da Formação
                </h5>
              </div>
              <div className="bg-light p-4 rounded-3">
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Formação</Form.Label>
                      <Form.Control
                        type="text"
                        name="formation"
                        value={formData.formation}
                        onChange={handleChange}
                        placeholder="Digite a especialização/formação do equitador"
                        className="form-control-lg"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                      />
                      <Form.Text className="text-muted">
                        Especialização técnica ou formação específica para
                        trabalho com cavalos
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        Data de Formação
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="formationDate"
                        value={formData.formationDate}
                        onChange={handleChange}
                        className="form-control-lg"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                        }}
                        min="1920-01-01"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-5">
              <Button
                variant="outline-secondary"
                className="me-3"
                onClick={() => navigate("/listar-funcionarios-ativos")}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || cpfError || emailError}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  backgroundColor: "#9B2D20",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "500",
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
                  "Concluir novo cadastro"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CadastroEquitador;
