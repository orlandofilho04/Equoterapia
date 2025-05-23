import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../services/api";
import "./ListarPraticantes.css";

function PraticantesArquivados() {
  const navigate = useNavigate();
  const [praticantes, setPraticantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPraticantesArquivados() {
      try {
        const response = await api.get("/pacients");
        setPraticantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar praticantes:", error);
      }
    }

    fetchPraticantesArquivados();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const praticantesArquivados = praticantes.filter(p => p.status == "ARQUIVADO");

  const filteredPraticantes = praticantesArquivados.filter(praticante =>
    praticante.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="listar-praticantes-container container my-5">
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
            value={searchTerm}
            onChange={handleSearch}
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
          {filteredPraticantes.map((praticante, index) => (
            <div
              key={index}
              className="bg-praticante list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <img
                  src={praticante.photo?.startsWith("http") ? praticante.photo : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Praticante"
                  className="rounded-circle me-3 img-perfil"
                />
                <div className="me-5">
                  <h5 className="mb-0">{praticante.name}</h5>
                </div>

                <div className="ms-5 me-5">
                  <p className="mb-0">{praticante.age ? `${praticante.age} anos` : "Idade não informada"}</p>
                </div>

                <div className="ms-5 me-5">
                  <p className="mb-0">{praticante.dataCadastro || "Data não informada"}</p>
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
