import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquoterapeutaAdm.css';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';



const DadosEquoterapeutaAdm = () => {
  const [conteudoAtivo, setConteudoAtivo] = useState('dadosPessoais');

  const renderDadosPessoais = () => (
    <>
      <div className="mt-5">
        <h5 className="title-adm mb-4">Dados de Identificação</h5>
        <ul className="list-unstyled">
          <li><strong className="color-brown">Nome Completo:</strong> Pedro Fran da Silva</li>
          <li><strong className="color-brown">Sexo:</strong> Masculino</li>
          <li><strong className="color-brown">CPF:</strong> 123.456.789-00</li>
          <li><strong className="color-brown">E-mail:</strong> exemplo@exemplo.com</li>
          <li><strong className="color-brown">Telefone:</strong> (62) 9.9999-9999</li>
          <li><strong className="color-brown">Endereço:</strong> Rua Exemplo, 123 - Cidade, Estado</li>
          <li><strong className="color-brown">Data de Nascimento:</strong> 01/01/1990</li>
        </ul>
      </div>
      <div className="mt-5">
        <h5 className="title-adm mb-4">Dados Profissionais</h5>
        <ul className="list-unstyled">
          <li><strong className="color-brown">Registro Profissional:</strong> Psicopedagogo - CFEP</li>
          <li><strong className="color-brown">Curso da ANDE-BRASIL:</strong> Sim</li>
        </ul>
      </div>
    </>
  );

  const pacientesCadastrados = [
    { id: 1, nome: "João Pedro Martins", idade: "7", data: "05 Dez 2024 15:59 PM", status: "Ativo" },
    { id: 2, nome: "João Pedro Martins", idade: "7", data: "05 Dez 2024 15:59 PM", status: "Ativo" },
    { id: 3, nome: "João Pedro Martins", idade: "7", data: "05 Dez 2024 15:59 PM", status: "Ativo" },
    { id: 4, nome: "João Pedro Martins", idade: "7", data: "05 Dez 2024 15:59 PM", status: "Ativo" },
  ];

  const renderPacientesCadastrados = (pacientes) =>
  pacientes.map((pac) => (
    <div key={pac.id} className="sessao-item d-flex align-items-center mb-3 p-3">
      <img src="https://img.freepik.com/fotos-gratis/menino-com-dente-de-leao_23-2148551195.jpg?t=st=1732983080~exp=1732986680~hmac=2cea84846f4d3f48d3f0e2db2e371ca7c952071fbbcd6f9d2edffa8fe650a589&w=740" alt="Avatar" className="sessao-avatar me-3" />
      <div className="sessao-info flex-grow-1 d-flex justify-content-between align-items-center">
        <p className="mb-0"><strong>{pac.nome}</strong></p>
        <p className="mb-0">Idade: {pac.idade} Anos</p>
        <p className="mb-0">Data da sessão: {pac.data}</p>
      </div>
      <p className={`status ${pac.status === "Ativo" ? "text-success" : "text-danger"} mb-0`}>
        Status: {pac.status}
      </p>
      <i className="bi bi-three-dots" style={{ cursor: 'pointer', fontSize: '1.5rem' }}></i>
    </div>
  ));

  return (
    <div className="container my-5">
      <Row className="mb-3">
        <Col md={2}>
          <img
            src="https://pics.loveplanet.ru/2/foto/15/ce/15cee737/eEoqpJw==_.jpg?p=aWN@+bVjT@mkJ_"
            alt="Foto do usuário"
            className="img-fluid rounded-circle img-adm"
          />
        </Col>

        <Col>
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="title-adm green">Pedro Fran</h3>
              <p className="sub-title-adm">Equoterapeuta</p>
            </div>
            <p className="color-brown">
              <strong>Data de cadastro:</strong> 17 Nov 2024 13:46 PM
            </p>
          </div>
          <Link className="btn btnC-adm text-white" role="button" aria-pressed="true">
            Editar informações
          </Link>
        </Col>
      </Row>

 
    <div className="btn-container">
        <div
            className={`title-div-adm ${conteudoAtivo === 'dadosPessoais' ? 'active-btn' : ''}`}
            onClick={() => setConteudoAtivo('dadosPessoais')}
            style={{ cursor: 'pointer' }}>
            Dados Pessoais
        </div>

        <div
            className={`title-div-adm ${conteudoAtivo === 'pacientesCadastrados' ? 'active-btn' : ''}`}
            onClick={() => setConteudoAtivo('pacientesCadastrados')}
            style={{ cursor: 'pointer' }}>
            Pacientes Cadastrados
        </div>
    </div>
      <div className="mt-5">
        {conteudoAtivo === 'dadosPessoais' ? renderDadosPessoais() : renderPacientesCadastrados(pacientesCadastrados)}
      </div>
    </div>
  );
};

export default DadosEquoterapeutaAdm;
