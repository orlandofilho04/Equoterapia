import "./App.css";
import React from "react";
import Sidebar from "./components/Sidebar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./services/PrivateRoute.js"
import Agenda from "./components/Agenda.js";
import NewAgenda from "./components/newAgenda.js";
import Login from "./components/Login";
import EsqueceuSenha from "./components/EsqueceuSenha";
import CodigoVerificacao from "./components/Codigo";
import NovaSenha from "./components/NovaSenha";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarEquitador from "./components/equitador/SidebarEquitador.js";
import ListarEquino from "./components/equitador/ListarEquino";
import CadastroPraticante1 from "./components/praticante/CadastroPraticante1";
import CadastroPraticante2 from "./components/praticante/CadastroPraticante2";
import ProximasSessoes from "./components/praticante/ProximasSessoes";
import CadastrarEquino from "./components/equitador/CadastrarEquino.js";
import DadosEquino from "./components/equitador/DadosEquino.js";
import CadastroEquoterapeuta from "./components/administrador/CadastroEquoterapeuta";
import CadastroEquitador from "./components/administrador/CadastroEquitador";
import ListarPraticantesAtivos from "./components/praticante/ListarPraticantesAtivos";
import ListarPraticantesArquivados from "./components/praticante/ListarPraticantesArquivados";
import AgendaEquitador from "./components/equitador/AgendaEquitador.js";
import SidebarAdministrador from "./components/administrador/SidebarAdministrador";
import AgendaAdministrador from "./components/administrador/AgendaAdministrador";
import ListarFuncionariosAtivos from "./components/administrador/ListarFuncionariosAtivos";
import ListarFuncionariosArquivados from "./components/administrador/ListarFuncionariosArquivados";
import CadastroProfissionalForm from "./components/administrador/CadastroProfissionalForm";
import DadosEquitadorAdm from "./components/administrador/DadosEquitadorAdm.js";
import DadosEquoterapeutaAdm from "./components/administrador/DadosEquoterapeutaAdm.js";
import FeedbackSessaoAnterior from "./components/praticante/FeedbackSessaoAnterior.js";
import DetalhesSessao from "./components/praticante/DetalhesSessao.js";
import InformacoesPraticante from "./components/praticante/InformacoesPraticante.js";
import FinalizarSessao from "./components/praticante/FinalizarSessao.js";
import PrivateRoute from "./services/PrivateRoute.js";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rota padrão */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas sem Proteção */}
          <Route path="/login" element={<Login />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="/codigo-verificacao" element={<CodigoVerificacao />} />
          <Route path="/nova-senha" element={<NovaSenha />} />

          {/* Rotas com Proteção */}
          <Route
            path="/agenda-geral"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <Agenda />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/novo-agendamento"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <NewAgenda />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/equitador/"
            element={
              <PrivateRoute>
                <div className="row">
                  <div className="col-12 col-md-3">
                    <SidebarEquitador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/equitador/agenda"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarEquitador />
                  <div className="content">
                    <AgendaEquitador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/equitador/listar-equino"
            element={
              <PrivateRoute>
                <div className="row">
                  <div className="col-12 col-md-3">
                    <SidebarEquitador />
                  </div>
                  <div className="col-12 col-md-9">
                    <ListarEquino />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastrar-equino"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarEquitador />
                  <div className="content">
                    <CadastrarEquino />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/dados-equino/:id"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarEquitador />
                  <div className="content">
                    <DadosEquino />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-praticante"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <CadastroPraticante1 />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-praticante/2"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <CadastroPraticante2 />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/proximas-sessoes"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <ProximasSessoes />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-profissional1"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <CadastroEquoterapeuta />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-equitador"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <CadastroEquitador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/listar-praticantes"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <ListarPraticantesAtivos />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/listar-praticantes-arquivados"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <ListarPraticantesArquivados />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/administrador"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <AgendaAdministrador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/administrador/agenda"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <AgendaAdministrador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/agenda"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <AgendaAdministrador />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/listar-funcionarios-ativos"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <ListarFuncionariosAtivos />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/listar-funcionarios-arquivados"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <ListarFuncionariosArquivados />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-profissional"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <CadastroProfissionalForm />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/dados-equitador-adm"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <DadosEquitadorAdm />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/dados-equoterapeuta-adm"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <SidebarAdministrador />
                  <div className="content">
                    <DadosEquoterapeutaAdm />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/FeedbackSessaoAnterior"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <FeedbackSessaoAnterior />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/DetalhesSessao"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <DetalhesSessao />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/FinalizarSessao"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <FinalizarSessao />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/InformacoesPraticante"
            element={
              <PrivateRoute>
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <InformacoesPraticante />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
