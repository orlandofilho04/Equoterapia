import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../services/api";
import "./ListarPraticantes.css";

function PraticantesAtivos() {
  const navigate = useNavigate();
  const [praticantes, setPraticantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPraticantes() {
      try {
        const response = await api.get("/pacients");
        setPraticantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar praticantes:", error);
      }
    }

    fetchPraticantes();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const praticantesAtivos = praticantes;

  // Filtra por nome
  const filteredPraticantes = praticantesAtivos.filter(praticante =>
    praticante.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="listar-praticantes-container container my-5">
      <div className="content">
        <div className="cor-padrao-praticante header d-flex justify-content-between align-items-center my-3">
          <h2>Praticantes cadastrados</h2>
        </div>

        {/* Filtro */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Procurar um Praticante"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Aba de status */}
        <div className="tabs mb-3 header d-flex">
          <button 
            className="cor-padrao-btn-praticante btn me-2"
            onClick={() => navigate("/listar-praticantes")}
          >
            Praticantes Ativos
          </button>
          <button 
            className="btn btn-light"
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

        {/* Lista de praticantes */}
        <div className="conteudo-lista list-group">
          {filteredPraticantes.map((praticante, index) => (
            <div
              key={index}
              className="bg-praticante list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <img
                  src={praticante.photo || "https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"}
                  alt="Praticante"
                  className="rounded-circle me-3 img-perfil"
                />
                <div className="me-5">
                  <h5 className="mb-0">{praticante.name}</h5>
                </div>

                <div className="me-5">
                  <p className="mb-0">{praticante.age ? `${praticante.age} anos` : "Idade não informada"}</p>
                </div>

                <div className="me-5">
                  <p className="mb-0">{praticante.dataCadastro || "Data não informada"}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="cor-padrao-btn-praticante badge me-3">Status: Ativo</span>
                <button className="btn btn-light btn-sm">Arquivar praticante</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PraticantesAtivos;
