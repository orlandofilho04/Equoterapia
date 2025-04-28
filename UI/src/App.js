import "./App.css";
import React from "react";
import Sidebar from "./components/Sidebar.js";
import "bootstrap/dist/css/bootstrap.min.css";
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


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rotas sem Sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="/codigo-verificacao" element={<CodigoVerificacao />} />
          <Route path="/nova-senha" element={<NovaSenha />} />
          
          {/* Rotas com Sidebar */}
          <Route
            path="/"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <Agenda />
                </div>
              </div>
            }
          />
          <Route
            path="/novo-agendamento"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <NewAgenda />
                </div>
              </div>
            }
          />
          <Route
            path="/equitador/"
            element={
              <div className="row">
                <div className="col-12 col-md-3">
                  <SidebarEquitador />
                </div>
              </div>
            }
          />
          <Route
            path="/equitador/agenda"
            element={
              <div className="app-content">
                <SidebarEquitador />
                <div className="content">
                  <AgendaEquitador />
                </div>
              </div>
            }
          />
          <Route
            path="/equitador/listar-equino"
            element={
              <div className="row">
                <div className="col-12 col-md-3">
                  <SidebarEquitador />
                </div>
                <div className="col-12 col-md-9">
                  <ListarEquino />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastrar-equino"
            element={
              <div className="app-content">
                <SidebarEquitador />
                <div className="content">
                  <CadastrarEquino />
                </div>
              </div>
            }
          />
          <Route
            path="/dados-equino"
            element={
              <div className="app-content">
                <SidebarEquitador />
                <div className="content">
                  <DadosEquino />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastro-praticante"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <CadastroPraticante1 />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastro-praticante/2"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <CadastroPraticante2 />
                </div>
              </div>
            }
          />
          <Route
            path="/proximas-sessoes"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <ProximasSessoes />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastro-profissional1"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <CadastroEquoterapeuta />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastro-equitador"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <CadastroEquitador />
                </div>
              </div>
            }
          />
          <Route
            path="/listar-praticantes"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <ListarPraticantesAtivos />
                </div>
              </div>
            }
          />
          <Route
            path="/listar-praticantes-arquivados"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <ListarPraticantesArquivados />
                </div>
              </div>
            }
          />
          <Route
            path="/administrador"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <AgendaAdministrador />
                </div>
              </div>
            }
          />
          <Route
            path="/administrador/agenda"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <AgendaAdministrador />
                </div>
              </div>
            }
          />
          <Route
            path="/agenda"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <AgendaAdministrador />
                </div>
              </div>
            }
          />
          <Route
            path="/listar-funcionarios-ativos"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <ListarFuncionariosAtivos />
                </div>
              </div>
            }
          />
          <Route
            path="/listar-funcionarios-arquivados"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <ListarFuncionariosArquivados />
                </div>
              </div>
            }
          />
          <Route
            path="/cadastro-profissional"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <CadastroProfissionalForm />
                </div>
              </div>
            }
          />

          <Route
            path="/dados-equitador-adm"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <DadosEquitadorAdm />
              </div>
              </div>
            }
          />

          <Route
            path="/dados-equoterapeuta-adm"
            element={
              <div className="app-content">
                <SidebarAdministrador />
                <div className="content">
                  <DadosEquoterapeutaAdm />
              </div>
              </div>
            }
          />
          <Route
            path="/FeedbackSessaoAnterior"
            element={
              <div className="app-content">
                <Sidebar />
                <div className="content">
                  <FeedbackSessaoAnterior />
                </div>
              </div>
            }
          />

          <Route
              path="/DetalhesSessao"
              element={
                <div className="app-content">
                  <Sidebar />

                  <div className="content">
                  <DetalhesSessao />
                  </div>
                  
                  
                </div>

              }
          />

          <Route
              path="/FinalizarSessao"
              element={
                <div className="app-content">
                  <Sidebar />

                  <div className="content">
                  <FinalizarSessao />

                  </div>
                  
                  
                </div>

              }
          />



          <Route
              path="/InformacoesPraticante"
              element={
                <div className="app-content">
                  <Sidebar />
                  <div className="content">
                    <InformacoesPraticante />
                  </div>
                </div>
              }
            />

        </Routes>
      </div>
    </Router>
  );
}

export default App;