import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CabecalhoSessao from './CabecalhoSessao';

const DetalhesSessao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

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
        const response = await api.get(`/api/sessions/${id}`);

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

  // Dados de teste para quando a API não está disponível
  const testeSessao = {
    id: "123",
    condutor: "João Silva (Dados de Teste)",
    mediadores: ["Maria Oliveira", "Carlos Santos"],
    encilhamento: "Convencional",
    cavalo: "Trovão",
    observacoes: "Sessão de teste para visualização quando a API não está disponível. Exibindo dados fictícios para avaliação do layout e funcionamento do componente.",
    finalizada: false,
    dataHora: "25/04/2025 14:30"
  };

  const finalizarSessao = async () => {
    try {
      const response = await api.post(`/api/sessions/${id}/finalizar`);
      if (response.status === 200) {
        alert('Sessão finalizada com sucesso!');
        setSessao({ ...sessao, finalizada: true });
      } else {
        throw new Error('Erro ao finalizar a sessão');
      }
    } catch (err) {
      console.error('Erro ao finalizar sessão:', err);
      alert('Não foi possível finalizar a sessão. Tente novamente.');
    }
  };

  // Função para testar o componente com dados fictícios
  const exibirDadosTeste = () => {
    setSessao(testeSessao);
    setError(null);
    setLoading(false);
  };

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
              <button onClick={exibirDadosTeste} style={{...estilos.button, backgroundColor: '#ffc107', color: '#000'}}>
                Exibir Dados de Teste
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
            <button onClick={exibirDadosTeste} style={{...estilos.button, backgroundColor: '#ffc107', color: '#000'}}>
              Exibir Dados de Teste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <CabecalhoSessao />
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <div style={estilos.infoGrid}>
            <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}>
              <strong>Condutor:</strong> {sessao?.condutor || 'Não informado'}
            </p>
            <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}>
              <strong>Mediador(es):</strong> {sessao?.mediadores?.join(", ") || 'Não informado'}
            </p>
            <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}>
              <strong>Encilhamento:</strong> {sessao?.encilhamento || 'Não informado'}
            </p>
            <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}>
              <strong>Cavalo:</strong> {sessao?.cavalo || 'Não informado'}
            </p>
          </div>
        </div>

        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde }}>
            Observações
          </h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}>
            {sessao?.observacoes || 'Sem observações registradas'}
          </p>
        </div>

        <div style={estilos.buttonContainer}>
          <button onClick={() => navigate(-1)} style={estilos.button}>
            Voltar
          </button>
          {!sessao.finalizada && (
            <button
              onClick={finalizarSessao}
              style={{ ...estilos.button, backgroundColor: '#07C158', color: '#fff' }}
            >
              Finalizar Sessão
            </button>
          )}
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
