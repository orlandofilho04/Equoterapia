import React, { useState, useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Sidebar.css";
import "./SidebarEquitador.css";

const SidebarEquitador = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name');

  useEffect(() => {
    // Atualiza o botão ativo baseado na rota atual
    const path = location.pathname;
    if (path.includes('/equitador/agenda')) {
      setActiveButton('agenda');
    } else if (path.includes('/equitador/listar-equino')) {
      setActiveButton('listarEquino');
    }
    
    // Detecta tamanho da tela para mostrar/esconder sidebar em dispositivos móveis
    const handleResize = () => {
      if (window.innerWidth > 992) {
        // Em telas grandes, a sidebar sempre fica visível
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verificar o tamanho da tela ao carregar
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    
    // Fechar o menu após clique em dispositivos móveis
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(false);
    }
    
    switch(button) {
      case "agenda":
        navigate("/equitador/agenda"); // Nova rota para agenda do equitador
        break;
      case "listarEquino":
        navigate("/equitador/listar-equino");
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
      {/* Botão de menu hamburger para dispositivos móveis */}
      <button 
        className="hamburger-menu d-lg-none" 
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Overlay para fechar o menu quando clicar fora (apenas mobile) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`sidebar p-3 ${isSidebarOpen ? "show-mobile-sidebar" : ""}`}>
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
        <h6 className="username-equitador mb-5 fw-bold">{name.length > 30 ? `${name.slice(0, 30)}...` : name}</h6>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "agenda" ? "active-button-equitador" : "btn-light"
          }`}
          onClick={() => handleButtonClick("agenda")}
        >
          Acessar Agenda <span className="arrow">&gt;</span>
        </button>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "listarEquino" ? "active-button-equitador" : "btn-light"
          }`}
          onClick={() => handleButtonClick("listarEquino")}
        >
          Listar Equinos <span className="arrow">&gt;</span>
        </button>
      </div>
    </>
  );
};

export default SidebarEquitador;