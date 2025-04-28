import React, { useState, useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("Nome do Usuário");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    switch (button) {
      case "agenda":
        navigate("/");
        break;
      case "sessoes":
        navigate("/proximas-sessoes");
        break;
      case "praticantes":
        navigate("/listar-praticantes");
        break;
      default:
        break;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar p-3 ${isSidebarOpen ? "open" : ""}`}>
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

        <h5 className="text-center mb-2 fw-bold">Bem Vindo!</h5>
        <h6 className="username mb-5 fw-bold">{username}</h6>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "agenda" ? "active-button" : "btn-light"
          }`}
          onClick={() => handleButtonClick("agenda")}
        >
          Acessar Agenda <span className="arrow">&gt;</span>
        </button>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "sessoes" ? "active-button" : "btn-light"
          }`}
          onClick={() => handleButtonClick("sessoes")}
        >
          Próximas Sessões <span className="arrow">&gt;</span>
        </button>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "praticantes" ? "active-button" : "btn-light"
          }`}
          onClick={() => handleButtonClick("praticantes")}
        >
          Listar Praticantes <span className="arrow">&gt;</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;