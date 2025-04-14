import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CabecalhoSessao from './CabecalhoSessao';
import api from '../../services/api';

const DetalhesSessao = () => {
  const { id } = useParams();
  const [sessao, setSessao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        const response = await api.get(`/sessions/${id}`);
        setSessao(response.data);
      } catch (err) {
        setError('Erro ao carregar detalhes da sessão');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessao();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!sessao) return <div>Sessão não encontrada</div>;

  return (
    <div style={estilos.container}>
      <CabecalhoSessao />
      
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Condutor:</strong> {sessao.condutor}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Mediador(es):</strong> {sessao.mediadores?.join(", ")}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Encilhamento:</strong> {sessao.encilhamento}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Cavalo:</strong> {sessao.cavalo}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Observações para a sessão</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>{sessao.observacoes}</p>
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
    color: '#193238',
    margin: '5px 0'
  }
};

export default DetalhesSessao;
