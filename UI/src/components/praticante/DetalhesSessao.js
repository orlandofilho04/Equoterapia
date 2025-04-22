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

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/sessions/${id}`);

        if (response.data) {
          console.log('Sessão carregada:', response.data);
          setSessao(response.data);
        } else {
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar sessão:', err);
        setError('Não foi possível carregar os detalhes da sessão');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessao();
    } else {
      setLoading(false); // Garante que o estado de carregamento seja atualizado
    }
  }, [id]);

  const finalizarSessao = async () => {
    try {
      const response = await api.post(`/api/sessions/${id}/finalizar`);
      if (response.status === 200) {
        alert('Sessão finalizada com sucesso!');
        setSessao({ ...sessao, finalizada: true }); // Atualiza o estado da sessão
      } else {
        throw new Error('Erro ao finalizar a sessão');
      }
    } catch (err) {
      console.error('Erro ao finalizar sessão:', err);
      alert('Não foi possível finalizar a sessão. Tente novamente.');
    }
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
            <button onClick={() => navigate('/sessoes')} style={estilos.button}>
              Voltar para lista
            </button>
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
          <h3 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde }}>
            Detalhes da Sessão
          </h3>

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
  // Estilos permanecem os mesmos...
};

export default DetalhesSessao;
