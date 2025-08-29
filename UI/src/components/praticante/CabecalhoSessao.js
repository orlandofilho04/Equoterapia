import React, { useState, useEffect } from 'react';
import './FotoEstilo.css';
import fotoDefault from "../imgs/foto.jpg";
import gear from '../imgs/gear.png';
import { Link, useParams } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import api from '../../services/api';

const CabecalhoSessao = (props) => {
  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [reload, setReload] = useState(false);
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
  const [sessionEnd, setSessionEnd] = useState({
    duration:"",
    sessionHour:"",
    sessionStatus: "CONCLUIDA",
    pacient_id: "",
    horse_id: "",
    equitor_id: "",
    mediator_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

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
        const response = await api.get(`/sessions/${sessionId}`);
        const sessao = response.data;
        
        if (!sessao) {
          throw new Error('Dados da sessão não encontrados');
        }
        
        const dataHora = new Date(sessao.sessionHour);
        const horaInicio = formatarHora(dataHora);

        const horaFim = new Date(dataHora);
        horaFim.setHours(horaFim.getHours() + 1);
        const horarioFim = formatarHora(horaFim);

        const horarioCompleto = `${horaInicio} – ${horarioFim}`;
        const dataFormatada = formatarData(dataHora);

        // Calcular idade
        const dataNascimento = new Date(sessao.pacient.birthDate);
        const idade = calcularIdade(dataNascimento);

        // Verificar se há uma URL de foto, senão usar a padrão
        const fotoUrl = sessao.pacient.photo || fotoDefault;

        // Atualizar o estado com os dados da API
        setSessionEnd({
          id: sessao.id,
          duration: sessao.duration,
          sessionHour: sessao.sessionHour,
          sessionStatus: "CONCLUIDA",
          equitor: { id: sessao.equitor?.id },
          mediator: { id: sessao.mediator?.id },
          pacient: { id: sessao.pacient?.id },
          horse: { id: sessao.horse?.id },
        });
        setSessionData({
          numeroSessao: sessao.id || sessionId,
          status: sessao.sessionStatus === "CONCLUIDA" ? "Finalizada" : "Aberta",
          praticante: {
            nome: sessao.pacient.name,
            idade: `${idade} anos`,
            foto: fotoUrl,
            id: sessao.pacient.id
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
  }, [id, props.sessionId, reload]);
  
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
  
  // Redirecionamento para a tela FinalizarSessao
  const finalizarSessao = async () => {
    try {

      const response = await api.put(
        `/sessions/${props.sessionId}`,
        sessionEnd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setSessionData(prev => ({ ...prev, sessionStatus: "CONCLUIDA" }));
        setTimeout(() => {
          setReload(prev => !prev);
        }, 2000);
      } else {
        setShowError(true);
      }
    } catch (err) {
      console.error("Erro ao finalizar sessão:", err);
      setShowError(true);
    }
  };

  return (
    <>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    bg="success"
                    onClose={() => setShowSuccess(false)}
                    show={showSuccess}
                    delay={2000}
                    autohide
                >
                    <Toast.Body className="text-white text-center">Sessão finalizada com sucesso!</Toast.Body>
                </Toast>

                <Toast
                    bg="danger"
                    onClose={() => setShowError(false)}
                    show={showError}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className="text-white text-center">Erro ao finalizar sessão. Verifique com o suporte.</Toast.Body>
                </Toast>
            </ToastContainer>
      <div style={estilos.header}>
        <h2>Sessão {id} - <span style={{...estilos.status, color: sessionData.status === "Finalizada" ? "red" : "#07C158"}}>{sessionData.status}</span></h2>
      </div>
      <div>
        <div style={{ display: 'flex', gap: '20px', paddingBottom: '20px' }}>
          <img src={sessionData.praticante.foto} alt="foto" title="foto" className="rounded-photo" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
              <div>
                <h3 style={estilos.nomeEstilo}>{sessionData.praticante.nome}</h3>
                <p style={{ margin: '5px 0' }}>{sessionData.praticante.idade}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '15px' }}>
                <div>
                  <strong>Horário da sessão: </strong>{sessionData.horario}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Data: </strong>{sessionData.data}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                    fontSize: '16px',
                    textDecoration: 'none',
                    textAlign: 'center'
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
