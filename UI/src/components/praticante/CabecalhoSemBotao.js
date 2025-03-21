import React from 'react';
import './FotoEstilo.css';
import foto from "../imgs/foto.jpg"
import BotaoEfeito from './BotaoEfeito';

const CabecalhoSemBotao = ({ sessionData = {
    numeroSessao: "1",
    status: "Finalizar sessão",
    praticante: {
      nome: "Ana Silva Barbosa",
      idade: "12 anos",
      foto: foto
    },
    horario: "14:30 – 15:30",
    data: "15/11/24"
  }, ...props }) => {

  return (
    <>
      <div style={estilos.header}>
        <h2>Sessão {sessionData.numeroSessao} - <span style={estilos.status}>{sessionData.status}</span></h2>
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
          </div>
        </div>
        <div>
          <BotaoEfeito texto="Detalhes da Sessão" to={props.detalhesPath} />
          <BotaoEfeito texto="Informações do Praticante" to={props.informacoesPath} />
          <BotaoEfeito texto="Feedback da Sessão Anterior" to={props.feedbackPath} />
        </div>
      </div>
    </>
  );
};

const estilos = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    marginLeft: '-10px'
  },
  status: {
    color: 'red',
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

export default CabecalhoSemBotao;
