import React, { useState } from 'react';
import CabecalhoSemBotao from './CabecalhoSemBotao';
import { Link } from 'react-router-dom';

const FinalizarSessao = () => {
  const [mediador, setMediador] = useState('');
  const [condutor, setCondutor] = useState('');
  const [cavalo, setCavalo] = useState('');
  const [encilhamento, setEncilhamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [observacoesProxima, setObservacoesProxima] = useState('');
  
  const cavalos = ['Thor', 'Pegasus', 'Spirit', 'Luna', 'Storm'];
  const encilhamentos = ['Completo, com manta e estribo ajustados', 'Sem estribo', 'Apenas manta', 'Completo com manta'];
  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

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
    },
    inputContainer: {
      display: 'flex',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px'
    },
    inputField: {
      width: '401px',
      height: '63px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      color: '#B6B6B6'
    },
    select: {
      width: '401px',
      height: '63px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      color: '#B6B6B6'
    },
    textArea: {
      width: '1214px',
      height: '247px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      color: '#B6B6B6',
      resize: 'none'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '30px',
      marginLeft: '935px'
    },
    cancelButton: {
      width: '167px',
      height: '55px',
      backgroundColor: '#032437',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    saveButton: {
      width: '372px',
      height: '55px',
      backgroundColor: '#07C158',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px'
    }
  };

  return (
    <div style={estilos.container}>
      <CabecalhoSemBotao />
      
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>
            Nova evolução
          </h4>
        </div>

        <div style={estilos.inputContainer}>
          <div>
            <div style={estilos.inputGroup}>
              <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
                <strong>Mediador(es):</strong>
              </p>
              <input
                type="text"
                placeholder="Digite o nome do equitador"
                style={estilos.inputField}
                value={mediador}
                onChange={(e) => setMediador(e.target.value)}
              />
            </div>

            <div style={estilos.inputGroup}>
              <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
                <strong>Encilhamento:</strong>
              </p>
              <select 
                style={estilos.select}
                value={encilhamento}
                onChange={(e) => setEncilhamento(e.target.value)}
              >
                <option value="">Selecione o Encilhamento utilizado</option>
                {encilhamentos.map((enc, index) => (
                  <option key={index} value={enc}>{enc}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={estilos.inputGroup}>
            <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
              <strong>Condutor:</strong>
            </p>
            <input
              type="text"
              placeholder="Digite o nome do Condutor"
              style={estilos.inputField}
              value={condutor}
              onChange={(e) => setCondutor(e.target.value)}
            />
          </div>

          <div style={estilos.inputGroup}>
            <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
              <strong>Cavalo:</strong>
            </p>
            <select 
              style={estilos.select}
              value={cavalo}
              onChange={(e) => setCavalo(e.target.value)}
            >
              <option value="">Selecione um cavalo</option>
              {cavalos.map((cavalo, index) => (
                <option key={index} value={cavalo}>{cavalo}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>
            Feedback
          </h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
            <strong>Observações gerais</strong>
          </p>
          <textarea
            placeholder="Observações gerais..."
            style={estilos.textArea}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <div style={estilos.section}>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}>
            <strong>Observações para a Próxima Sessão</strong>
          </p>
          <textarea
            placeholder="Observações..."
            style={estilos.textArea}
            value={observacoesProxima}
            onChange={(e) => setObservacoesProxima(e.target.value)}
          />
        </div>

        <div style={estilos.buttonContainer}>
          <Link to="/pagina-anterior">
            <button style={estilos.cancelButton}>
              Cancelar
            </button>
          </Link>
          <Link to="/pagina-destino">
            <button style={estilos.saveButton}>
              Salvar e finalizar sessão
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinalizarSessao;
