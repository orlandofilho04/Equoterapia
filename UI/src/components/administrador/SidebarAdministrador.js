import React, { useState, useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Sidebar.css";
import "./SidebarAdministrador.css";

const SidebarAdministrador = () => {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Atualiza o botão ativo baseado na rota atual
    const path = location.pathname;
    if (path.includes('/administrador/agenda')) {
      setActiveButton('agenda');
    } else if (path.includes('/listar-funcionarios')) {
      setActiveButton('profissionais');
    }
  }, [location]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    switch(button) {
      case "agenda":
        navigate("/administrador/agenda");
        break;
      case "profissionais":
        navigate("/listar-funcionarios-ativos");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout se necessário
    navigate("/login");
  };

  return (
    <div className="sidebar p-3">
      <button 
        className="btn exit-button d-flex align-items-center"
        onClick={handleLogout}
      >
        <RxExit className="exit-icon me-2" />
        <span>Sair</span>
      </button>

      <div className="profile-pic my-4">
        <img
          src="https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"
          alt="Perfil do Administrador"
          className="rounded-circle"
        />
      </div>

      <h5 className="text-center mb-2 fw-bold">Bem-vindo!</h5>
      <h6 className="username-administrador mb-5 fw-bold">ADMINISTRADOR</h6>

      <button
        className={`btn sidebar-button mb-4 fw-bold ${
          activeButton === "agenda" ? "active-button-administrador" : ""
        }`}
        onClick={() => handleButtonClick("agenda")}
      >
        Acessar agenda <span className="arrow">&gt;</span>
      </button>

      <button
        className={`btn sidebar-button mb-4 fw-bold ${
          activeButton === "profissionais" ? "active-button-administrador" : ""
        }`}
        onClick={() => handleButtonClick("profissionais")}
      >
        Listar Profissionais <span className="arrow">&gt;</span>
      </button>
    </div>
  );
};

export default SidebarAdministrador;