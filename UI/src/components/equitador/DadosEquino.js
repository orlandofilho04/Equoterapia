import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquino.css';
import api from "../../services/api";

const DadosEquino = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadHorseData = async () => {
      try {
        const response = await api.get(`/horses/${id}`);
        setHorse(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao buscar dados do cavalo');
      } finally {
        setLoading(false);
      }
    };

    loadHorseData();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) return <div className="container my-5">Carregando dados...</div>;
  if (error) return <div className="container my-5 text-danger">Erro: {error}</div>;
  if (!horse) return <div className="container my-5">Nenhum cavalo encontrado.</div>;

  return (
    <div className='container my-5'>
      <Row className="mb-3">
        <Col md={2}>
          <img
            src="https://www.sunsetbeachclub.com/storage/pages/Leisure/750x750el-ranchito-caballo.png"
            alt="Imagem do Equino"
            className="img-fluid img rounded"
          />
        </Col>

        <Col>
          <div className='d-flex gap-5'>
            <h3 className="title-sec fw-bold">{horse.name}</h3>
            <p className='color-grey ms-5'>
              <strong>Data de cadastro:</strong> {horse.createdAt ? formatDate(horse.createdAt) : 'Não informado'}
            </p>
          </div>
          <p className="text-muted sub-title-sec">{horse.age} anos</p>

          <Link to={`/editar-equino/${id}`} className="btn btnB-equino" role="button" aria-pressed="true">
            Editar Informações
          </Link>
        </Col>
      </Row>

      <div className='title-div'>Dados Equino</div>

      <div className="my-5">
        <h5 className="title-sec mb-4">Identificação do Equino</h5>
        <ul className="list-unstyled">
          <li><strong>Nome do Equino:</strong> {horse.name}</li>
          <li><strong>Número de Registro:</strong> {horse.registerCode || 'Não informado'}</li>
          <li><strong>Raça:</strong> {horse.breed || 'Não informado'}</li>
          <li><strong>Sexo:</strong> {horse.sex || 'Não informado'}</li>
          <li><strong>Idade:</strong> {horse.age} anos</li>
        </ul>
      </div>

      <div className="my-5">
        <h5 className="title-sec mb-4">Características Físicas</h5>
        <ul className="list-unstyled">
          <li><strong>Peso do Equino:</strong> {horse.weight ? `${horse.weight} kg` : 'Não informado'}</li>
          <li><strong>Altura do Equino:</strong> {horse.height ? `${horse.height} m` : 'Não informado'}</li>
          <li><strong>Cor da Pelagem:</strong> {horse.coatColor || 'Não informado'}</li>
          <li><strong>Marcha:</strong> {horse.gait || 'Não informado'}</li>
          <li><strong>Marca ou Características Especiais:</strong> {horse.specialsTraits || 'Nenhuma'}</li>
        </ul>
      </div>

      <div className="my-5">
        <h5 className="title-sec mb-4">Equipamentos</h5>
        <ul className="list-unstyled">
          <li><strong>Equipamentos:</strong> {horse.weight ? `${horse.equipment}` : 'Não informado'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DadosEquino