import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DadosEquino.css"; // Importa o novo CSS
import api from "../../services/api";
import { format, parseISO } from "date-fns"; // Importa do date-fns
import { ptBR } from "date-fns/locale";

const DadosEquino = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadHorseData = async () => {
      try {
        const response = await api.get(`/horses/${id}`);
        setHorse(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Erro ao buscar dados do cavalo"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHorseData();
  }, [id]);

  // Função auxiliar para renderizar os itens de informação, evitando repetição
  const renderInfoItem = (label, value, unit = "") => (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">
        {value ? `${value} ${unit}`.trim() : "Não informado"}
      </span>
    </div>
  );

  if (loading)
    return <div className="loading-container">Carregando dados...</div>;
  if (error) return <div className="error-container">Erro: {error}</div>;
  if (!horse)
    return <div className="loading-container">Nenhum cavalo encontrado.</div>;

  return (
    <div className="details-container">
      <div className="details-header">
        <img
          src={horse.photo || "https://i.imgur.com/AhdG3Q2.png"} // Imagem placeholder
          alt="Imagem do Equino"
          className="header-image"
        />
        <div className="header-info">
          <h2>{horse.name}</h2>
          <p>
            Cadastrado em:{" "}
            {horse.createdAt
              ? format(parseISO(horse.createdAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })
              : "Não informado"}
          </p>
          <Link to={`/editar-equino/${id}`} className="action-button">
            Editar Informações
          </Link>
        </div>
      </div>

      <div className="info-card">
        <h4 className="info-card-title">Identificação do Equino</h4>
        <div className="info-grid">
          {renderInfoItem("Nome do Equino", horse.name)}
          {renderInfoItem("Número de Registro", horse.registerCode)}
          {renderInfoItem("Raça", horse.breed)}
          {renderInfoItem("Sexo", horse.sex)}
          {renderInfoItem("Idade", horse.age, "anos")}
        </div>
      </div>

      <div className="info-card">
        <h4 className="info-card-title">Características Físicas</h4>
        <div className="info-grid">
          {renderInfoItem("Peso do Equino", horse.weight, "kg")}
          {renderInfoItem("Altura do Equino", horse.height, "m")}
          {renderInfoItem("Cor da Pelagem", horse.coatColor)}
          {renderInfoItem("Marcha", horse.gait)}
          {renderInfoItem(
            "Marca ou Características Especiais",
            horse.specialsTraits
          )}
        </div>
      </div>

      <div className="info-card">
        <h4 className="info-card-title">Equipamentos</h4>
        <div className="info-grid">
          {renderInfoItem("Equipamentos Utilizados", horse.equipment)}
        </div>
      </div>
    </div>
  );
};

export default DadosEquino;
