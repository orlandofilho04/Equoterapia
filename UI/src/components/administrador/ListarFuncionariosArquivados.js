import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarFuncionarios.css";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alert, Spinner, Button, Badge, Pagination, Form, Table } from 'react-bootstrap';

function ListarFuncionariosArquivados() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reactivateLoading, setReactivateLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const fetchProfissionais = async () => {
    try {
      setLoading(true);
      // Modificado para usar o endpoint correto e filtrar no frontend
      const response = await api.get('/professional');
      // Filtrando apenas os profissionais arquivados
      const archivedProfessionals = response.data.filter(prof => prof.archived === true);
      setProfissionais(archivedProfessionals);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar profissionais arquivados. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao buscar profissionais arquivados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleReactivate = async (id) => {
    try {
      setReactivateLoading(prev => ({ ...prev, [id]: true }));
      setError(null);
      setSuccess(false);
      // Adaptando para usar o endpoint correto do backend
      await api.put(`/professional/${id}`, { archived: false });
      setProfissionais(profissionais.filter(prof => prof.id !== id));
      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao reativar profissional. Por favor, tente novamente.';
      setError(errorMessage);
      console.error('Erro ao reativar profissional:', err);
    } finally {
      setReactivateLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProfissionais = profissionais
    .filter(profissional =>
      profissional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      return (aValue - bValue) * direction;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProfissionais.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProfissionais.length / itemsPerPage);

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

  const renderSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Funcionários Arquivados</h1>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => navigate('/listar-funcionarios-ativos')}
          >
            Funcionários Ativos
          </Button>
          <Button 
            className="button-add btn"
            onClick={() => navigate('/cadastro-profissional')}
          >
            Cadastrar Novo
          </Button>
        </div>
      </div>
      
      <hr className="divider" />

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          Profissional reativado com sucesso!
        </Alert>
      )}

      <Form.Control
        type="text"
        placeholder="Buscar por nome ou função..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  Nome {renderSortIcon('name')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('role')}
                >
                  Função {renderSortIcon('role')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('createdAt')}
                >
                  Data de Cadastro {renderSortIcon('createdAt')}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <Alert variant="info">
                      Nenhum funcionário arquivado encontrado.
                    </Alert>
                  </td>
                </tr>
              ) : (
                currentItems.map((profissional) => (
                  <tr key={profissional.id}>
                    <td>
                      <Link to={`/dados-${profissional.role.toLowerCase()}-adm/${profissional.id}`}>
                        <img
                          src={profissional.photoUrl || "https://img.freepik.com/fotos-premium/icone-plano-isolado-no-fundo_1258715-220844.jpg?semt=ais_hybrid"}
                          alt="Funcionário"
                          className="rounded-circle img-perfil"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link 
                        to={`/dados-${profissional.role.toLowerCase()}-adm/${profissional.id}`}
                        className="text-decoration-none"
                      >
                        {profissional.name}
                      </Link>
                    </td>
                    <td>
                      <Badge bg="info">{getRoleDisplay(profissional.role)}</Badge>
                    </td>
                    <td>
                      {new Date(profissional.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Button 
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleReactivate(profissional.id)}
                        disabled={reactivateLoading[profissional.id]}
                      >
                        {reactivateLoading[profissional.id] ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                        ) : null}
                        Reativar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListarFuncionariosArquivados;
