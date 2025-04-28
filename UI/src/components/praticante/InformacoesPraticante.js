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
  const [errorDetail, setErrorDetail] = useState(null);

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchPraticante = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetail(null);

        // Incluindo logs para melhor diagnóstico
        console.log(`Buscando praticante com ID: ${id}`);
        
        // Teste direto de conexão para diagnóstico
        try {
          const testResponse = await api.get('/api');
          console.log('Teste de conexão com API bem sucedido:', testResponse);
        } catch (testErr) {
          console.warn('Teste inicial de API falhou:', testErr.message);
        }

        // Tentativa com endpoint específico
        const response = await api.get(`/api/praticantes/${id}`);

        if (response.data) {
          console.log('Praticante carregado com sucesso:', response.data);
          setPraticante(response.data);
        } else {
          console.warn('API retornou resposta vazia');
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar praticante:', err);
        
        // Detalhes adicionais para diagnóstico
        let mensagemErro = 'Não foi possível carregar os detalhes do praticante';
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
      fetchPraticante();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Template de dados para teste (apenas se não houver dados da API)
  const testePraticante = {
    nomeCompleto: "Carlos Silva (Dados de Teste)",
    sexo: "Masculino",
    cartaoSUS: "123456789012345",
    dataNascimento: "01/02/2010",
    idade: "15 anos",
    telefone: "(11) 98765-4321",
    email: "responsavel@exemplo.com",
    endereco: "Rua Exemplo, 123 - Bairro - Cidade/UF",
    cuidador: "João Silva",
    nomePai: "José Silva",
    nomeMae: "Maria Silva",
    escolaridade: {
      escola: "Escola Municipal",
      anoSerie: "5º Ano",
      turma: "A",
      periodo: "Matutino"
    },
    diagnosticoClinico: "Teste diagnóstico para visualização de dados quando a API não está disponível."
  };

  // Função para testar o componente com dados fictícios
  const exibirDadosTeste = () => {
    setPraticante(testePraticante);
    setError(null);
    setLoading(false);
  };

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
          {errorDetail && (
            <p style={{...estilos.textoPreto, fontSize: '14px', color: '#666'}}>
              Detalhes: {errorDetail}
            </p>
          )}
          <div style={estilos.buttonContainer}>
            <button onClick={() => navigate('/praticantes')} style={estilos.button}>
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

  if (!praticante) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>Praticante não encontrado.</p>
          <div style={estilos.buttonContainer}>
            <button onClick={() => navigate('/praticantes')} style={estilos.button}>
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
    color: '#000',
    margin: '5px 0'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
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

export default InformacoesPraticante;

