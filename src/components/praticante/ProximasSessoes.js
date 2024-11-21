import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./ProximasSessoes.css"; 

const ProximasSessoes = () => {
  const [tipoSessao, setTipoSessao] = useState("abertas");

  const sessoesAbertas = [
    { id: 1, nome: "João Pedro Martins", idade: 7, data: "20 Nov 2024 14:00 PM", status: "Aberta" },
    { id: 2, nome: "Wanessa Ferreira", idade: 6, data: "22 Nov 2024 13:00 PM", status: "Aberta" },
    { id: 3, nome: "Pedro Martins", idade: 8, data: "22 Nov 2024 15:00 PM", status: "Aberta" },
    { id: 4, nome: "José Alves", idade: 5, data: "23 Nov 2024 16:30 PM", status: "Aberta" },
  ];

  const sessoesConcluidas = [
    { id: 1, nome: "Maria Clara", idade: 10, data: "10 Nov 2024 10:00 AM", status: "Concluída" },
    { id: 2, nome: "Carlos Silva", idade: 9, data: "12 Nov 2024 11:00 AM", status: "Concluída" },
  ];

  const renderSessoes = (sessoes) =>
  sessoes.map((sessao) => (
    <div key={sessao.id} className="sessao-item d-flex align-items-center mb-3 p-3">
      <img src="https://img.freepik.com/fotos-gratis/menino-sorridente-a-posar-no-parque_23-2148647750.jpg?t=st=1732166129~exp=1732169729~hmac=c031217a4cbe58214f30cfd8fddcbc231084956f701f70de229c9d973bf89ab1&w=740" alt="Avatar" className="sessao-avatar me-3" />

      <div className="sessao-info flex-grow-1 d-flex justify-content-between align-items-center">
        <p className="mb-0"><strong>{sessao.nome}</strong></p>
        <p className="mb-0">Idade: {sessao.idade} Anos</p>
        <p className="mb-0">Data da sessão: {sessao.data}</p>
      </div>
      <p className={`status ${sessao.status === "Aberta" ? "text-success" : "text-danger"} mb-0`}>
        Status: {sessao.status}
      </p>
    </div>
  ));


  return (
    <>
      <div className="d-flex">
        <div className="content-container p-4">
          <h1 className="titulo">Próximas Sessões</h1>
          <div className="mb-4">
            <Button
              variant={tipoSessao === "abertas" ? "success" : "outline-secondary"}
              className="me-2 botoes"
              onClick={() => setTipoSessao("abertas")}
            >
              Sessões Abertas
            </Button>
            <Button
              variant={tipoSessao === "concluidas" ? "success" : "outline-secondary"}
              className="botoes"
              onClick={() => setTipoSessao("concluidas")}
            >
              Sessões Concluídas
            </Button>
          </div>
        </div>
      </div>

      <hr className="linha-full" />

      <div className="sessao-listagem">
        {tipoSessao === "abertas"
          ? renderSessoes(sessoesAbertas)
          : renderSessoes(sessoesConcluidas)}
      </div>
    </>
  );
};

export default ProximasSessoes;