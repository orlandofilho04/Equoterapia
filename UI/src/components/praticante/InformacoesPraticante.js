import React from 'react';
import CabecalhoSessao from './CabecalhoSessao';
const InformacoesPraticante = () => {
  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  const dadosPraticante = {
    nomeCompleto: "João Pedro Martins",
    sexo: "Masculino", 
    cartaoSUS: "99 99999 9999",
    dataNascimento: "10/06/2017",
    idade: "7 Anos",
    telefone: "(62) 99999-9999",
    email: "exemplo@exemplo.com",
    endereco: "Av. Pres. Vargas 220, Setor Central 459, Ceres - GO",
    cuidador: "Mãe",
    nomePai: "Carlos Eduardo Martins",
    nomeMae: "Maria Fernanda Martins"
  };

  const dadosEscolaridade = {
    escola: "Escola Bernardo Sayão (Privada)",
    anoSerie: "Ensino Fundamental – 2º ano",
    turma: "Inclusão",
    periodo: "Matutino"
  };

  const diagnosticoClinico = "João Pedro apresenta diagnóstico de Transtorno do Déficit de Atenção com Hiperatividade (TDAH), caracterizado por sintomas de desatenção, impulsividade e hiperatividade. Esses sintomas afetam tanto o desempenho escolar quanto as interações sociais, além de dificultarem o foco em atividades cotidianas.\n\nNo campo motor, João apresenta dificuldades leves de coordenação e equilíbrio, que foram notadas desde a primeira infância. Atraso no desenvolvimento motor foi relatado pelos pais, com dificuldades iniciais em caminhar e manter-se estável sem apoio até aproximadamente 2 anos e meio.\n\nAtualmente, essas dificuldades refletem-se na capacidade de realizar atividades físicas que demandam maior controle postural e coordenação motora fina.";

  return (
    <div style={estilos.container}>
      <CabecalhoSessao />
      
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Dados de Identificação</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Nome Completo:</strong> {dadosPraticante.nomeCompleto}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Sexo:</strong> {dadosPraticante.sexo}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Nº Cartão SUS:</strong> {dadosPraticante.cartaoSUS}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Data de Nascimento:</strong> {dadosPraticante.dataNascimento} ({dadosPraticante.idade})</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Telefone:</strong> {dadosPraticante.telefone}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>E-mail:</strong> {dadosPraticante.email}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Endereço:</strong> {dadosPraticante.endereco}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Cuidador:</strong> {dadosPraticante.cuidador}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Nome do Pai:</strong> {dadosPraticante.nomePai}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Nome da Mãe:</strong> {dadosPraticante.nomeMae}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Escolaridade do Praticante</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Escolaridade do Praticante:</strong> {dadosEscolaridade.escola}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Ano/Série:</strong> {dadosEscolaridade.anoSerie}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Turma:</strong> {dadosEscolaridade.turma}</p>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto}}><strong>Período:</strong> {dadosEscolaridade.periodo}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold'}}>Diagnóstico Clínico</h4>
          <p style={{...estilos.textoPreto, fontSize: tamanhoTextoPreto, whiteSpace: 'pre-wrap'}}>{diagnosticoClinico}</p>
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

export default InformacoesPraticante;
