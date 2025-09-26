import React, { useEffect, useState } from "react";
import "./ListarEquino.css";
import SearchBar from "../SearchBar.js";
import { Link } from "react-router-dom";
import { format, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../../services/api";

const ListarEquino = () => {
  const [equinosAtivos, setEquinosAtivos] = useState([]);
  const [equinosArquivados, setEquinosArquivados] = useState([]);

  useEffect(() => {
    const loadHorse = async () => {
      const response = await api.get(`/horses`);
      const ativos = [];
      const arquivados = [];

      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].status === "ARQUIVADO") {
          arquivados.push(response.data[i]);
        } else {
          ativos.push(response.data[i]);
        }
      }
      setEquinosAtivos(ativos);
      setEquinosArquivados(arquivados);
    };

    loadHorse();
  }, []);

  const [exibirAtivos, setExibirAtivos] = useState(true);

  return (
    <div className="container">
      <h1 className="page-title">Equinos Cadastrados</h1>
      <SearchBar className="listar-equinos-searchbar" />

      <div className="button-group">
        <button
          className={`button-filter me-2 ${
            exibirAtivos ? "btn-active" : "btn-outline-secondary"
          }`}
          onClick={() => setExibirAtivos(true)}
        >
          Equinos Ativos
        </button>
        <button
          className={`button-filter ${
            !exibirAtivos ? "btn-active" : "btn-outline-secondary"
          }`}
          onClick={() => setExibirAtivos(false)}
        >
          Equinos Arquivados
        </button>
        <Link to="/cadastrar-equino" className="button-add btn">
          Cadastre um novo Equino
        </Link>
      </div>

      <hr className="divider" />

      <div className="listar-equinos">
        {(exibirAtivos ? equinosAtivos : equinosArquivados).map((equino) => (
          <div
            key={equino.id}
            className="item-container d-flex align-items-center"
          >
            <Link to={`/dados-equino/${equino.id}`}>
              <img
                src={
                  equino.photo
                    ? equino.photo
                    : "https://img.freepik.com/fotos-gratis/bela-vista-de-um-magnifico-cavalo-branco-com-o-campo-verde_181624-14424.jpg?t=st=1732245856~exp=1732249456~hmac=04d8eb3ea75eb418bdfca534b6ad1dcdf726f0a8155d9011bac86f34e12f7aaa&w=740"
                }
                alt="Equino"
                className="avatar me-3"
              />
            </Link>
            <div className="info">
              <p className="text mb-0">
                <b>{equino.name}</b>
              </p>
              <p className="text mb-0">Idade: {equino.age}</p>
              <p className="text mb-0">
                Data de cadastro:{" "}
                {format(
                  subHours(new Date(equino.createdAt), 3),
                  "dd/MM/yyyy 'às' HH:mm",
                  { locale: ptBR }
                )}
              </p>
            </div>
            <div className="status text-end me-3">
              <span
                className={`status-text ${
                  exibirAtivos ? "text-success" : "text-danger"
                }`}
              >
                {exibirAtivos ? "Status: Ativo" : "Status: Arquivado"}
              </span>
            </div>
            <button className="action-button">
              {exibirAtivos ? "Arquivar Equino" : "Desarquivar Equino"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarEquino;
