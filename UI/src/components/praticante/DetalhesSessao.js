import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CabecalhoSessao from './CabecalhoSessao';
import BotaoEfeito from "./BotaoEfeito";

const DetalhesSessao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("detalhes");
  //const token = localStorage.getItem('token');

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetail(null);

        // Incluindo logs para melhor diagnóstico
        console.log(`Buscando sessão com ID: ${id}`);

        // Tentativa com endpoint específico
        const response = await api.get(`/sessions/${id}`);

        if (response.data) {
          console.log('Sessão carregada com sucesso:', response.data);
          setSessao(response.data);
        } else {
          console.warn('API retornou resposta vazia');
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar sessão:', err);
        
        // Detalhes adicionais para diagnóstico
        let mensagemErro = 'Não foi possível carregar os detalhes da sessão';
        let detalhesErro = '';
        
        if (err.response) {
          mensagemErro += ` (Erro ${err.response.status})`;
          detalhesErro = JSON.stringify(err.response.data);
          console.error('Detalhes do erro:', {
            status: err.response.status,
            data: err.response.data
          });
        } else if (err.request) {
          mensagemErro += ' (Servidor não respondeu)';
          detalhesErro = 'O servidor não retornou uma resposta. Verifique se o backend está rodando na porta 8080.';
          console.error('Sem resposta do servidor');
        } else {
          detalhesErro = err.message;
        }
        
        setError(mensagemErro);
        setErrorDetail(detalhesErro);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessao();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.loadingContainer}>
          <p>Carregando dados da sessão...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <div style={estilos.errorContainer}>
            <p style={estilos.error}>{error}</p>
            {errorDetail && (
              <p style={{...estilos.textoPreto, fontSize: '14px', color: '#666'}}>
                Detalhes: {errorDetail}
              </p>
            )}
            <div style={estilos.buttonContainer}>
              <button onClick={() => navigate('/sessoes')} style={estilos.button}>
                Voltar para lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessao) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.error}>Sessão não encontrada.</p>
          <div style={estilos.buttonContainer}>
            <button onClick={() => navigate('/sessoes')} style={estilos.button}>
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <CabecalhoSessao sessionId={id} />

      <div style={estilos.contentContainer}>
        <div style={{ display: "flex", gap: "20px", margin: "20px 0", width: "max-content" }}>
          <BotaoEfeito
            texto="Detalhes da Sessão"
            onClick={() => setActiveTab("detalhes")}
            ativo={activeTab === "detalhes"}
          />
          <BotaoEfeito
            texto="Informações do Praticante"
            onClick={() => setActiveTab("praticante")}
            ativo={activeTab === "praticante"}
          />
          <BotaoEfeito
            texto="Feedback da Sessão Anterior"
            onClick={() => setActiveTab("feedback")}
            ativo={activeTab === "feedback"}
          />
        </div>

        {/* Conteúdo renderizado */}
        <div>
          {activeTab === "detalhes" && (
            <>
              <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Condutor:</strong> {sessao?.equitor?.name}</p>
              <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Mediador:</strong> {sessao?.mediator?.name}</p>
              <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Cavalo:</strong> {sessao?.horse?.name}</p>
            </>
          )}

          {activeTab === "praticante" && (
            <>
              <div style={estilos.section}>
                <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Dados de Identificação</h4>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome Completo:</strong> {sessao?.pacient?.name}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Sexo:</strong> {sessao?.pacient?.gender === "M" ? "Masculino" : "Feminino"}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nº Cartão SUS:</strong> {sessao?.pacient?.susCardNumber}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Data de Nascimento:</strong> {format(new Date(sessao?.pacient?.birthDate), "dd/MM/yyyy", { locale: ptBR })}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Telefone:</strong> {sessao?.pacient?.phone}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>E-mail:</strong> {sessao?.pacient?.email}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Endereço:</strong> {sessao?.pacient?.address}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Cuidador:</strong> {sessao?.pacient?.caregiver}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome do Pai:</strong> {sessao?.pacient?.fatherName}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome da Mãe:</strong> {sessao?.pacient?.motherName}</p>
              </div>

              <div style={estilos.section}>
                <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Escolaridade do Praticante</h4>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Escolaridade do Praticante:</strong> {sessao?.pacient?.education?.school}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Ano/Série:</strong> {sessao?.pacient?.education?.anoSerie}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Turma:</strong> {sessao?.pacient?.education?.turma}</p>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Período:</strong> {sessao?.pacient?.education?.periodo}</p>
              </div>

              <div style={estilos.section}>
                <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Diagnóstico Clínico</h4>
                <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto, whiteSpace: 'pre-wrap' }}>{sessao?.pacient?.diagnosticoClinico}</p>
              </div>
            </>
          )}

          {activeTab === "feedback" && (
            <>
              <p>Aqui vão ser mostrados os dados do feedback.</p>
            </>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            background: "#0275d8",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

const estilos = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    marginLeft: '10px'
  },
  contentContainer: {
    marginLeft: '10px',
    marginRight: '20px',
    marginTop: '30px',
    marginBottom: '20px'
  },
  section: {
    marginBottom: '30px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginTop: '15px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  errorContainer: {
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#fff9f9',
    borderLeft: '5px solid #dc3545',
  },
  error: {
    color: '#dc3545',
    fontSize: '18px',
    marginBottom: '10px',
  },
  tituloVerde: {
    color: '#07C158',
    margin: '0'
  },
  textoPreto: {
    color: '#000',
    margin: '5px 0'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0275d8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default DetalhesSessao;
