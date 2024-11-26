import React from 'react';
import { Link } from 'react-router-dom'; // Importando Link para navegação

const BotaoVerde = ({ texto, to }) => {
  const styles = {
    button: {
      backgroundColor: "#07C158",  // Cor de fundo verde
      border: 'none',            // Sem borda
      color: 'white',            // Cor do texto branco
      fontSize: '14px',          // Tamanho da fonte
      padding: '10px 20px',      // Espaçamento interno
      borderRadius: '50px',      // Bordas arredondadas
      cursor: 'pointer',        // Cursor de pointer ao passar por cima
      textDecoration: 'none',    // Sem sublinhado
    },
    buttonHover: {
      backgroundColor: "#07C158",  // Cor do botão ao passar o mouse
    }
  };

  // Função para aplicar o efeito de hover
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = styles.button.backgroundColor;
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={styles.button}
        onMouseOver={handleMouseOver}  // Aciona o efeito de hover
        onMouseOut={handleMouseOut}    // Retira o efeito de hover
      >
        {texto}
      </button>
    </Link>
  );
};

export default BotaoVerde;
