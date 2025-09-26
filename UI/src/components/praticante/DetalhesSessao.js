import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import CabecalhoSessao from "./CabecalhoSessao";
import BotaoEfeito from "./BotaoEfeito";
import "./DetalhesSessao.css"; // Importa o novo arquivo CSS

const DetalhesSessao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("praticante"); // Inicia na aba do praticante

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/sessions/${id}`);
        setSessao(response.data);
      } catch (err) {
        setError("Não foi possível carregar os detalhes da sessão.");
        console.error("Falha ao carregar sessão:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSessao();
  }, [id]);

  const renderInfoItem = (label, value) => (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || "Não informado"}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">Carregando dados da sessão...</div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!sessao) {
    return <div className="loading-container">Sessão não encontrada.</div>;
  }

  return (
    <div className="details-container">
      <CabecalhoSessao sessionId={id} />

      <div className="tab-navigation">
        <BotaoEfeito
          texto="Detalhes da Sessão"
          onClick={() => setActiveTab("detalhes")}
          ativo={activeTab === "detalhes"}
        />
        <BotaoEfeito
          texto="Informações do Praticante"
          onClick={() => setActiveTab("praticante")}
          ativo={activeTab === "praticante"}
        />
        <BotaoEfeito
          texto="Feedback da Sessão"
          onClick={() => setActiveTab("feedback")}
          ativo={activeTab === "feedback"}
        />
      </div>

      <div className="tab-content">
        {activeTab === "detalhes" && (
          <div className="info-card">
            <h4 className="info-card-title">Equipe e Animal</h4>
            <div className="info-grid">
              {renderInfoItem("Condutor", sessao?.equitor?.name)}
              {renderInfoItem("Mediador", sessao?.mediator?.name)}
              {renderInfoItem("Cavalo", sessao?.horse?.name)}
            </div>
          </div>
        )}

        {activeTab === "praticante" && (
          <>
            <div className="info-card">
              <h4 className="info-card-title">Dados de Identificação</h4>
              <div className="info-grid">
                {renderInfoItem("Nome Completo", sessao?.pacient?.name)}
                {renderInfoItem(
                  "Sexo",
                  sessao?.pacient?.gender === "M" ? "Masculino" : "Feminino"
                )}
                {renderInfoItem(
                  "Data de Nascimento",
                  format(parseISO(sessao?.pacient?.birthDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                )}
                {renderInfoItem("Nº Cartão SUS", sessao?.pacient?.susNumber)}
                {renderInfoItem("Telefone", sessao?.pacient?.phoneNumber)}
                {renderInfoItem("E-mail", sessao?.pacient?.email)}
                {renderInfoItem("Endereço", sessao?.pacient?.address)}
                {renderInfoItem("Cuidador", sessao?.pacient?.caregiverName)}
                {renderInfoItem("Nome do Pai", sessao?.pacient?.fatherName)}
                {renderInfoItem("Nome da Mãe", sessao?.pacient?.motherName)}
              </div>
            </div>

            <div className="info-card">
              <h4 className="info-card-title">Escolaridade</h4>
              <div className="info-grid">
                {renderInfoItem("Instituição", sessao?.pacient?.schoolName)}
                {renderInfoItem("Ano/Série", sessao?.pacient?.schoolYear)}
                {renderInfoItem("Turma", sessao?.pacient?.scholarClass)}
                {renderInfoItem("Período", sessao?.pacient?.schoolShift)}
              </div>
            </div>

            <div className="info-card">
              <h4 className="info-card-title">Diagnóstico Clínico</h4>
              <div className="info-item">
                <span className="info-value pre-wrap">
                  {sessao?.pacient?.clinicDiagnosis || "Não informado"}
                </span>
              </div>
            </div>
          </>
        )}

        {activeTab === "feedback" && (
          <div className="info-card">
            <p>Aqui vão ser mostrados os dados do feedback.</p>
          </div>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        Voltar
      </button>
    </div>
  );
};

export default DetalhesSessao;
