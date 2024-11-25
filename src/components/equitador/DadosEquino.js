import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquino.css';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DadosEquino = () => {
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
                        <h3 className="title-sec fw-bold">Pegalasso</h3>
                        <p className='color-grey ms-5'><strong>Data de cadastro: </strong>17 Nov 2024 11:59 PM</p>
                    </div>
                    <p className="text-muted sub-title-sec">7 anos</p>

                    <Link className="btn btnC" role="button" aria-pressed="true">
                            Editar Informações
                    </Link>
                    </Col>
                </Row>

                <div className='title-div'>
                    Dados Equino
                </div>
                
                <div className="my-5">
                    <h5 className="title-sec mb-4" >Identificação do Equino</h5>
                    <ul className="list-unstyled">
                        <li><strong>Nome do Equino:</strong> Pegalasso</li>
                        <li><strong>Número de Registro:</strong> 209519/D</li>
                        <li><strong>Raça:</strong> Quarto de Milha</li>
                        <li><strong>Sexo:</strong> Macho</li>
                        <li><strong>Idade:</strong> 18 meses</li>
                    </ul>
                </div>
                
                <div className="my-5">
                    <h5 className="title-sec mb-4" >Características Físicas</h5>
                    <ul className="list-unstyled">
                        <li><strong>Peso do Equino:</strong> 420 kg</li>
                        <li><strong>Altura do Equino:</strong> 1,85 m</li>
                        <li><strong>Cor da Pelagem:</strong> Café Torrado</li>
                        <li><strong>Marca ou Características Especiais:</strong> Nenhuma</li>
                    </ul>
                </div>
        </div>
    );
};

export default DadosEquino;
