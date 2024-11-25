import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarFuncionarios.css";
import { Link } from 'react-router-dom';


function ListarFuncionariosAtivos() {
  return (
    <div className="listar-funcionarios-container container my-5">
      {/* Conteúdo principal */}
      <div className="content">
        <div className="cor-padrao-funcionario header d-flex justify-content-between align-items-center my-3">
          <h2>Funcionários Cadastrados</h2>
        </div>

        {/* Filtro */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Procurar um Funcionário Ativo"
          />
        </div>

        {/* Aba de status */}
        <div className="tabs mb-3 header d-flex">
          <button className="cor-padrao-btn-funcionario btn me-2">Funcionários Ativos</button>
          <button className="btn btn-light"><a href="listar-funcionarios-arquivados">Funcionários Arquivados</a></button>
          <button className="cor-padrao-btn-funcionario btn ms-auto">Cadastre um novo Funcionário</button>
        </div>

        {/* Lista de funcionarios */}
        <div className="conteudo-lista list-group">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-praticante list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <Link to="/dados-equitador-adm">
                <img
                  src="https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"
                  alt="Funcionário"
                  className="rounded-circle me-3 img-perfil"
                />
                </Link>
                
                <div className="me-5">
                  <h5 className="mb-0">NOME</h5>
                </div>

                <div className="me-5">
                  <p className="mb-0">FUNÇÃO</p>
                </div>

                <div className="me-5">
                  <p className="mb-0">Data 01/01/2024</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
              <Link to="/dados-equoterapeuta-adm"> <span className="status-ativo badge me-3">Status: Ativo</span></Link>
                <button className="btn btn-light btn-sm">Arquivar funcionário</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListarFuncionariosAtivos;
