import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DadosEquino.css";
import api from "../../services/api";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

const DadosEquino = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta função encapsula toda a lógica de busca de dados
    const fetchHorseData = async () => {
      // Garante que o estado de loading esteja ativo no início da busca
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/horses/${id}`);

        if (response.data) {
          setHorse(response.data);
        } else {
          // Caso a API responda com 200 OK mas sem corpo de dados
          throw new Error("A resposta da API está vazia.");
        }
      } catch (err) {
        console.error("Falha ao buscar dados do cavalo:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Ocorreu um erro ao buscar os dados.";
        setError(errorMessage);
      } finally {
        // Independentemente de sucesso ou falha, o loading é encerrado
        setLoading(false);
      }
    };

    // A busca só é chamada se o 'id' existir
    if (id) {
      fetchHorseData();
    } else {
      // Se não houver id, encerra o loading e informa o usuário
      setLoading(false);
      setError("ID do equino não fornecido na URL.");
    }
  }, [id]); // O useEffect será reexecutado sempre que o 'id' mudar

  const safeFormatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = parseISO(dateString);
    return isValid(date)
      ? format(date, "dd/MM/yyyy", { locale: ptBR })
      : "Data inválida";
  };

  const renderInfoItem = (label, value, unit = "") => (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">
        {value ? `${value} ${unit}`.trim() : "Não informado"}
      </span>
    </div>
  );

  // Renderização condicional clara
  if (loading) {
    return <div className="loading-container">Carregando dados...</div>;
  }

  if (error) {
    return <div className="error-container">Erro: {error}</div>;
  }

  if (!horse) {
    return <div className="loading-container">Nenhum cavalo encontrado.</div>;
  }

  // Renderização do componente com os dados
  return (
    <div className="details-container">
      <div className="details-header">
        <img
          src={horse.photo || "https://i.imgur.com/AhdG3Q2.png"}
          alt="Imagem do Equino"
          className="header-image"
        />
        <div className="header-info">
          <h2>{horse.name}</h2>
          <p>Cadastrado em: {safeFormatDate(horse.createdAt)}</p>
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
