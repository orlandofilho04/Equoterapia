import React, { useState, useEffect } from 'react';
import './FotoEstilo.css';
import fotoDefault from "../imgs/foto.jpg";
import BotaoEfeito from './BotaoEfeito';
import BotaoVerde from './BotaoArredondado';
import gear from '../imgs/gear.png';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const CabecalhoSessao = (props) => {
  const { id } = useParams();
  const [sessionData, setSessionData] = useState({
    numeroSessao: "",
    status: "Carregando...",
    praticante: {
      nome: "Carregando...",
      idade: "",
      foto: fotoDefault,
      id: ""
    },
    horario: "",
    data: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar dados da sessão da API
        const sessionId = id || props.sessionId;
        
        if (!sessionId) {
          console.warn('ID da sessão não fornecido, usando dados padrão');
          // Se não houver ID, manter dados de demonstração
          setSessionData({
            numeroSessao: "1",
            status: "Aberta",
            praticante: {
              nome: "Ana Silva Barbosa",
              idade: "12 anos",
              foto: fotoDefault,
              id: "demo"
            },
            horario: "14:30 – 15:30",
            data: "15/11/24"
          });
          setLoading(false);
          return;
        }
        
        console.log(`Buscando dados da sessão com ID: ${sessionId}`);
        const sessionResponse = await api.get(`/api/sessions/${sessionId}`);
        
        if (!sessionResponse.data) {
          throw new Error('Dados da sessão não encontrados');
        }
        
        // Buscar dados do praticante da API
        const praticantId = sessionResponse.data.praticantId;
        const praticantResponse = await api.get(`/api/praticantes/${praticantId}`);
        
        if (!praticantResponse.data) {
          throw new Error('Dados do praticante não encontrados');
        }
        
        // Formatar data e hora no formato desejado
        const dataHora = new Date(sessionResponse.data.dataHora);
        const horaInicio = formatarHora(dataHora);
        
        // Adicionar 1 hora para o horário final
        const horaFim = new Date(dataHora);
        horaFim.setHours(horaFim.getHours() + 1);
        const horarioFim = formatarHora(horaFim);
        
        const horarioCompleto = `${horaInicio} – ${horarioFim}`;
        const dataFormatada = formatarData(dataHora);
        
        // Calcular idade
        const dataNascimento = new Date(praticantResponse.data.dataNascimento);
        const idade = calcularIdade(dataNascimento);
        
        // Verificar se há uma URL de foto, senão usar a padrão
        const fotoUrl = praticantResponse.data.fotoUrl || fotoDefault;
        
        // Atualizar o estado com os dados da API
        setSessionData({
          numeroSessao: sessionResponse.data.numeroSessao || sessionId,
          status: sessionResponse.data.finalizada ? "Finalizada" : "Aberta",
          praticante: {
            nome: praticantResponse.data.nomeCompleto,
            idade: `${idade} anos`,
            foto: fotoUrl,
            id: praticantId
          },
          horario: horarioCompleto,
          data: dataFormatada
        });
        
      } catch (err) {
        console.error("Erro ao carregar dados da sessão:", err);
        setError("Não foi possível carregar os dados da sessão");
        
        // Em caso de erro, usar dados de demonstração
        setSessionData({
          numeroSessao: "1",
          status: "Aberta",
          praticante: {
            nome: "Ana Silva Barbosa",
            idade: "12 anos",
            foto: fotoDefault,
            id: "demo"
          },
          horario: "14:30 – 15:30",
          data: "15/11/24"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionData();
  }, [id, props.sessionId]);
  
  // Função para formatar a hora no padrão HH:MM
  const formatarHora = (data) => {
    return data.getHours().toString().padStart(2, '0') + ':' + 
           data.getMinutes().toString().padStart(2, '0');
  };
  
  // Função para formatar a data no padrão DD/MM/YY
  const formatarData = (data) => {
    return data.getDate().toString().padStart(2, '0') + '/' +
           (data.getMonth() + 1).toString().padStart(2, '0') + '/' +
           (data.getFullYear() % 100).toString().padStart(2, '0');
  };
  
  // Função para calcular idade
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  };
  
  // Finalizar sessão
  const finalizarSessao = async () => {
    try {
      const sessionId = id || props.sessionId;
      if (!sessionId || sessionId === "demo") {
        alert("Esta é uma sessão de demonstração e não pode ser finalizada");
        return;
      }
      
      const response = await api.post(`/api/sessions/${sessionId}/finalizar`);
      if (response.data) {
        setSessionData({
          ...sessionData,
          status: "Finalizada"
        });
        alert("Sessão finalizada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao finalizar sessão:", err);
      alert("Não foi possível finalizar a sessão. Tente novamente.");
    }
  };

  return (
    <>
      <div style={estilos.header}>
        <h2>Sessão {sessionData.numeroSessao} - <span style={{...estilos.status, color: sessionData.status === "Aberta" ? "red" : "#07C158"}}>{sessionData.status}</span></h2>
      </div>
      <div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <img src={sessionData.praticante.foto} alt="foto" title="foto" className="rounded-photo" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
              <div>
                <h3 style={estilos.nomeEstilo}>{sessionData.praticante.nome}</h3>
                <p style={{ margin: '5px 0' }}>{sessionData.praticante.idade}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div>
                  <strong>Horário da sessão: </strong>{sessionData.horario}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Data: </strong>{sessionData.data}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {sessionData.status !== "Finalizada" && (
                <button 
                  onClick={finalizarSessao}
                  style={{ 
                    padding: '10px 15px',
                    backgroundColor: '#07C158',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Finalizar Sessão
                </button>
              )}
              <Link 
                to="/configuracoes-sessao" 
                style={{ 
                  width: '31px', 
                  height: '35px', 
                  backgroundColor: 'black', 
                  border: 'none', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                <img 
                  src={gear} 
                  alt="icone" 
                  style={{ width: '25px', height: '25px' }} 
                />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <BotaoEfeito texto="Detalhes da Sessão" to={props.detalhesPath || `/sessao/${id || 'demo'}/detalhes`} />
          <BotaoEfeito texto="Informações do Praticante" to={props.informacoesPath || `/praticantes/${sessionData.praticante.id}`} />
          <BotaoEfeito texto="Feedback da Sessão Anterior" to={props.feedbackPath || `/sessao/${id || 'demo'}/feedback`} />
        </div>
      </div>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ marginTop: '10px' }}>
          Carregando dados da sessão...
        </div>
      )}
    </>
  );
};

const estilos = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  status: {
    transition: 'color 0.3s ease',
  },
  nomeEstilo: {
    color: '#07C158',
    margin: '0',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      textDecoration: 'underline',
      opacity: '0.8'
    }
  }
};

export default CabecalhoSessao;
