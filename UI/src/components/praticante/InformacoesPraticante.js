import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CabecalhoSessao from './CabecalhoSessao';

const InformacoesPraticante = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [praticante, setPraticante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchPraticante = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/praticantes/${id}`);

        if (response.data) {
          console.log('Praticante carregado:', response.data);
          setPraticante(response.data);
        } else {
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar praticante:', err);
        setError('Não foi possível carregar os detalhes do praticante');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPraticante();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p>Carregando dados do praticante...</p>
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
          <button onClick={() => navigate('/praticantes')} style={estilos.button}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  if (!praticante) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>Praticante não encontrado.</p>
          <button onClick={() => navigate('/praticantes')} style={estilos.button}>
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
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Dados de Identificação</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome Completo:</strong> {praticante.nomeCompleto}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Sexo:</strong> {praticante.sexo}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nº Cartão SUS:</strong> {praticante.cartaoSUS}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Data de Nascimento:</strong> {praticante.dataNascimento} ({praticante.idade})</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Telefone:</strong> {praticante.telefone}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>E-mail:</strong> {praticante.email}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Endereço:</strong> {praticante.endereco}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Cuidador:</strong> {praticante.cuidador}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome do Pai:</strong> {praticante.nomePai}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome da Mãe:</strong> {praticante.nomeMae}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Escolaridade do Praticante</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Escolaridade do Praticante:</strong> {praticante.escolaridade?.escola}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Ano/Série:</strong> {praticante.escolaridade?.anoSerie}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Turma:</strong> {praticante.escolaridade?.turma}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Período:</strong> {praticante.escolaridade?.periodo}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Diagnóstico Clínico</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto, whiteSpace: 'pre-wrap' }}>{praticante.diagnosticoClinico}</p>
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

export default InformacoesPraticante;

