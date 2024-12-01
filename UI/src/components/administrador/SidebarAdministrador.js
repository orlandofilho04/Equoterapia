import React, { useState } from "react";
import { RxExit } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import "../Sidebar.css";
import "./SidebarAdministrador.css";

const SidebarAdministrador = () => {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setActiveButton(button);
    switch(button) {
      case "agenda":
        navigate("/administrador/agenda");
        break;
      case "profissionais":
        navigate("/listar-funcionarios-ativos"); // Vai para a lista de funcionários ativos por padrão
        break;
      default:
        break;
    }
  };

  return (
    <div className="d-flex flex-column sidebar p-3">
      <Link to="/login" className="btn exit-button d-flex align-items-center">
        <RxExit className="exit-icon me-1 icon-large" />
        <span>Sair</span>
      </Link>

      <div className="profile-pic my-4">
        <img
          src="https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"
          alt="User Profile"
          className="rounded-circle"
        />
      </div>

      <h5 className="text-center mb-2 fw-bold">Bem vindo !</h5>
      <h6 className="username-administrador mb-5 fw-bold">ADMINISTRADOR</h6>

      <button
        className={`btn sidebar-button mb-4 fw-bold ${
          activeButton === "agenda" ? "active-button-administrador" : "btn-light"
        }`}
        onClick={() => handleButtonClick("agenda")}
      >
        Acessar agenda <span className="arrow">&gt;</span>
      </button>

      <button
        className={`btn sidebar-button mb-4 fw-bold ${
          activeButton === "profissionais" ? "active-button-administrador" : "btn-light"
        }`}
        onClick={() => handleButtonClick("profissionais")}
      >
        Listar Profissionais <span className="arrow">&gt;</span>
      </button>
    </div>
  );
};

export default SidebarAdministrador;