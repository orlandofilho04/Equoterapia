import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CabecalhoSessao from './CabecalhoSessao';

const FeedbackSessaoAnterior = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/sessions/${id}/feedback`);

        if (response.data) {
          console.log('Feedback carregado:', response.data);
          setFeedback(response.data);
        } else {
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar feedback:', err);
        setError('Não foi possível carregar o feedback da sessão anterior');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p>Carregando feedback da sessão anterior...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>{error}</p>
          <button onClick={() => navigate('/sessoes')} style={estilos.button}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>Feedback não encontrado.</p>
          <button onClick={() => navigate('/sessoes')} style={estilos.button}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <CabecalhoSessao />
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Observações Gerais</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>{feedback.observacoesGerais || 'Sem observações registradas'}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Observações para a Próxima Sessão</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>{feedback.observacoesProximaSessao || 'Sem observações registradas'}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Equipe</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Condutor:</strong> {feedback.condutor || 'Não informado'}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Mediador(es):</strong> {feedback.mediadores?.join(", ") || 'Não informado'}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Encilhamento:</strong> {feedback.encilhamento || 'Não informado'}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Cavalo:</strong> {feedback.cavalo || 'Não informado'}</p>
        </div>
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
    marginBottom: '20px',
  },
  tituloVerde: {
    color: '#07C158',
    margin: '0'
  },
  textoPreto: {
    color: '#000', // Revertido para preto puro
    margin: '5px 0'
  }
};

export default FeedbackSessaoAnterior;

