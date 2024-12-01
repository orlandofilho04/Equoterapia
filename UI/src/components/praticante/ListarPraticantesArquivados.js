import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarPraticantes.css";

function PraticantesArquivados() {
  const navigate = useNavigate();

  return (
    <div className="listar-praticantes-container container my-5">
      {/* Conteúdo principal */}
      <div className="content">
        <div className="cor-padrao-praticante header d-flex justify-content-between align-items-center my-3">
          <h2>Praticantes Arquivados</h2>
        </div>

        {/* Filtro */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Procurar um Praticante Arquivado"
          />
        </div>

        {/* Aba de status */}
        <div className="tabs mb-3 header d-flex">
          <button 
            className="btn btn-light me-2"
            onClick={() => navigate("/listar-praticantes")}
          >
            Praticantes Ativos
          </button>
          <button 
            className="cor-padrao-btn-praticante btn"
            onClick={() => navigate("/listar-praticantes-arquivados")}
          >
            Praticantes Arquivados
          </button>
          <button 
            className="cor-padrao-btn-praticante btn ms-auto"
            onClick={() => navigate("/cadastro-praticante")}
          >
            Cadastre um novo praticante
          </button>
        </div>

        {/* Lista de praticantes arquivados */}
        <div className="conteudo-lista list-group">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-praticante list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <img
                  src="https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"
                  alt="Praticante"
                  className="rounded-circle me-3 img-perfil"
                />
                <div className="me-5">
                  <h5 className="mb-0">NOME</h5>
                </div>

                <div className="ms-5 me-5">
                  <p className="mb-0">IDADE</p>
                </div>

                <div className="ms-5 me-5">
                  <p className="mb-0">Data 01/01/2024</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="cor-padrao-btn-praticante-arquivado badge me-3">Status: Arquivado</span>
                <button className="btn btn-light btn-sm">Reativar praticante</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PraticantesArquivados;