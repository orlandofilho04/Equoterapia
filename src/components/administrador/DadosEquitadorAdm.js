import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquitadorAdm.css';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';



const DadosEquitadorAdm = () => {
  const [conteudoAtivo, setConteudoAtivo] = useState('dadosPessoais');

  const renderDadosPessoais = () => (
    <>
      <div className="mt-5">
        <h5 className="title-adm mb-4">Dados de Identificação</h5>
        <ul className="list-unstyled">
          <li><strong className="color-brown">Nome Completo:</strong> Mario Brito Martins</li>
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
          <li><strong className="color-brown">Formação:</strong> Agronomia</li>
          <li><strong className="color-brown">Data de Conclusão:</strong> 10/10/2022</li>
        </ul>
      </div>
    </>
  );

  const equinosCadastrados = [
    { id: 1, nome: "Rajado", sexo: "Masculino", data: "05 Dez 2024 15:59 PM", status: "Ativo" },
    { id: 2, nome: "Chumbinho", sexo: "Masculino", data: "17 Nov 2024 07:27 AM", status: "Ativo" },
    { id: 3, nome: "Estrela", sexo: "Feminino", data: "09 Mar 2024 14:30 PM", status: "Ativo" },
    { id: 4, nome: "Rabisco", sexo: "Masculino", data: "21 Jan 2024 10:14 AM", status: "Arquivado" },
    { id: 5, nome: "Princesa", sexo: "Feminino", data: "25 Fev 2024 16:02 PM", status: "Arquivado" },
  ];

  const renderEquinosCadastrados = (equinos) =>
  equinos.map((equi) => (
    <div key={equi.id} className="sessao-item d-flex align-items-center mb-3 p-3">
      <img src="https://img.freepik.com/fotos-gratis/bela-vista-de-um-magnifico-cavalo-branco-com-o-campo-verde_181624-14424.jpg?t=st=1732245856~exp=1732249456~hmac=04d8eb3ea75eb418bdfca534b6ad1dcdf726f0a8155d9011bac86f34e12f7aaa&w=740" alt="Avatar" className="sessao-avatar me-3" />
      <div className="sessao-info flex-grow-1 d-flex justify-content-between align-items-center">
        <p className="mb-0"><strong>{equi.nome}</strong></p>
        <p className="mb-0">Idade: {equi.sexo} Anos</p>
        <p className="mb-0">Data da sessão: {equi.data}</p>
      </div>
      <p className={`status ${equi.status === "Ativo" ? "text-success" : "text-danger"} mb-0`}>
        Status: {equi.status}
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
              <h3 className="title-adm">Mario Brito</h3>
              <p className="sub-title-adm">Equitador</p>
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
            className={`title-div-adm ${conteudoAtivo === 'equinosCadastrados' ? 'active-btn' : ''}`}
            onClick={() => setConteudoAtivo('equinosCadastrados')}
            style={{ cursor: 'pointer' }}>
            Equinos Cadastrados
        </div>
    </div>



      <div className="mt-5">
        {conteudoAtivo === 'dadosPessoais' ? renderDadosPessoais() : renderEquinosCadastrados(equinosCadastrados)}
      </div>
    </div>
  );
};

export default DadosEquitadorAdm;
