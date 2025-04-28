import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarFuncionarios.css";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alert, Spinner } from 'react-bootstrap';

function ListarFuncionariosAtivos() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveLoading, setArchiveLoading] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const fetchProfissionais = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professionals/active');
      setProfissionais(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar profissionais. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao buscar profissionais:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleArchive = async (id) => {
    try {
      setArchiveLoading(prev => ({ ...prev, [id]: true }));
      setError(null);
      setSuccess(false);
      await api.put(`/professionals/${id}/archive`);
      setProfissionais(profissionais.filter(prof => prof.id !== id));
      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao arquivar profissional. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao arquivar profissional:', err);
    } finally {
      setArchiveLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const filteredProfissionais = profissionais.filter(profissional =>
    profissional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profissional.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'equoterapeuta':
        return 'Equoterapeuta';
      case 'equitador':
        return 'Equitador';
      default:
        return role;
    }
  };

  return (
    <div className="listar-funcionarios-container container my-5">
      {/* Conteúdo principal */}
      <div className="content">
        <div className="cor-padrao-funcionario header d-flex justify-content-between align-items-center my-3">
          <h2>Funcionários Cadastrados</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-3">
            Profissional arquivado com sucesso!
          </Alert>
        )}

        {/* Filtro */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Procurar um Funcionário Ativo"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Aba de status */}
        <div className="tabs mb-3 header d-flex">
          <button className="cor-padrao-btn-funcionario btn me-2">Funcionários Ativos</button>
          <button className="btn btn-light" onClick={() => navigate('/listar-funcionarios-arquivados')}>
            Funcionários Arquivados
          </button>
          <button 
            className="cor-padrao-btn-funcionario btn ms-auto"
            onClick={() => navigate('/cadastro-profissional')}
          >
            Cadastre um novo Funcionário
          </button>
        </div>

        {/* Lista de funcionarios */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : (
          <div className="conteudo-lista list-group">
            {filteredProfissionais.length === 0 ? (
              <div className="alert alert-info">
                Nenhum funcionário encontrado.
              </div>
            ) : (
              filteredProfissionais.map((profissional) => (
                <div
                  key={profissional.id}
                  className="bg-praticante list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <Link to={`/dados-${profissional.role.toLowerCase()}-adm/${profissional.id}`}>
                      <img
                        src={profissional.photoUrl || "https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"}
                        alt="Funcionário"
                        className="rounded-circle me-3 img-perfil"
                      />
                    </Link>
                    <div className="me-5">
                      <h5 className="mb-0">
                        <Link 
                          to={`/dados-${profissional.role.toLowerCase()}-adm/${profissional.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {profissional.name}
                        </Link>
                      </h5>
                    </div>

                    <div className="me-5">
                      <p className="mb-0">{getRoleDisplay(profissional.role)}</p>
                    </div>

                    <div className="me-5">
                      <p className="mb-0">Data {new Date(profissional.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="status-ativo badge me-3">Status: Ativo</span>
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={() => handleArchive(profissional.id)}
                      disabled={archiveLoading[profissional.id]}
                    >
                      {archiveLoading[profissional.id] ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                      ) : null}
                      Arquivar funcionário
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListarFuncionariosAtivos;
