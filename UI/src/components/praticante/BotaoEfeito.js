import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BotaoEfeito = ({ texto }) => {
  const location = useLocation();
  
  const getPath = (buttonText) => {
    switch(buttonText) {
      case "Detalhes da Sessão":
        return "/DetalhesSessao";
      case "Informações do Praticante":
        return "/InformacoesPraticante";
      case "Feedback da Sessão Anterior":
        return "/FeedbackSessaoAnterior";
      default:
        return "/";
    }
  };

  const to = getPath(texto);
  const isSelected = location.pathname === to;

  const styles = {
    button: {
      backgroundColor: 'transparent',
      border: 'none',
      color: isSelected ? '#07C158' : 'black',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '5px 10px',
      textDecoration: 'none',
      borderBottom: isSelected ? '2px solid #07C158' : '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      borderBottom: '2px solid #07C158',
      color: '#07C158'
    }
  };

  const handleMouseOver = (e) => {
    if (!isSelected) {
      e.target.style.borderBottom = styles.buttonHover.borderBottom;
      e.target.style.color = styles.buttonHover.color;
    }
  };

  const handleMouseOut = (e) => {
    if (!isSelected) {
      e.target.style.borderBottom = styles.button.borderBottom;
      e.target.style.color = styles.button.color;
    }
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={styles.button}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {texto}
      </button>
    </Link>
  );
};

export default BotaoEfeito;
