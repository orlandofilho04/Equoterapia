import React, { useState, useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../Sidebar.css";
import "./SidebarAdministrador.css";

const SidebarAdministrador = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obter o nome do usuário do localStorage
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }

    // Atualiza o botão ativo baseado na rota atual
    const path = location.pathname;
    if (path.includes('/administrador/agenda')) {
      setActiveButton('agenda');
    } else if (
      path.includes('/listar-funcionarios') || 
      path.includes('/cadastro-equoterapeuta') || 
      path.includes('/cadastro-equitador') ||
      path.includes('/cadastro-profissional') ||
      path.includes('/dados-profissional-adm') ||
      path.includes('/dados-equoterapeuta-adm') ||
      path.includes('/dados-equitador-adm')
    ) {
      setActiveButton('profissionais');
    } else {
      // Se nenhuma rota específica, agenda é o padrão (tela inicial)
      setActiveButton('agenda');
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
    // Limpar dados do usuário no localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('isAdmin');
    navigate("/login");
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
      
      <div className={`sidebar p-3 ${isSidebarOpen ? 'show-mobile-sidebar' : ''}`}>
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
        <h6 className="username-administrador mb-5 fw-bold">{userName || 'ADMINISTRADOR'}</h6>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "agenda" ? "active-button-administrador" : ""
          }`}
          onClick={() => handleButtonClick("agenda")}
          style={activeButton === "agenda" ? { backgroundColor: '#9B2D20', color: '#fff' } : {}}
        >
          Acessar agenda <span className="arrow">&gt;</span>
        </button>

        <button
          className={`btn sidebar-button mb-4 fw-bold ${
            activeButton === "profissionais" ? "active-button-administrador" : ""
          }`}
          onClick={() => handleButtonClick("profissionais")}
          style={activeButton === "profissionais" ? { backgroundColor: '#9B2D20', color: '#fff' } : {}}
        >
          Listar Profissionais <span className="arrow">&gt;</span>
        </button>
      </div>
    </>
  );
};

export default SidebarAdministrador;