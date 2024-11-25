import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquitadorAdm.css';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DadosPessoais = () => {
    return (
        <div className="container my-5">
            <Row className="mb-3">
                <Col md={2}>
                    <img
                        src="https://pics.loveplanet.ru/2/foto/15/ce/15cee737/eEoqpJw==_.jpg?p=aWN@+bVjT@mkJ_"                        alt="Foto do usuário"
                        className="img-fluid rounded-circle img-adm"
                    />
                </Col>

                <Col>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h3 className="title-adm">Mario Brito</h3>
                            <p className="sub-title-adm">Equitador</p>
                        </div>
                        <p className="color-brown">
                            <strong>Data de cadastro:</strong> 17 Nov 2024 13:46 PM
                        </p>
                    </div>
                    <Link className="btn btnC-adm text-white" role="button" aria-pressed="true">
                        Editar informações
                    </Link>
                </Col>
            </Row>

            <Row>
                <Col>
                    <div className='title-div-adm'>
                        <strong>Dados Pessoais</strong>
                    </div>    
                </Col>

                <Col>
                    <div className=''>
                        Pacientes Cadastrados
                    </div>    
                </Col>
            </Row>

            <div className="mt-5">
                <h5 className="title-adm mb-4">Dados de Identificação</h5>
                <ul className="list-unstyled">
                    <li>
                        <strong className="color-brown">Nome Completo:</strong> Mario Brito Martins
                    </li>
                    <li>
                        <strong className="color-brown">Sexo:</strong> Masculino
                    </li>
                    <li>
                        <strong className="color-brown">CPF:</strong> 123.456.789-00
                    </li>
                    <li>
                        <strong className="color-brown">E-mail:</strong> exemplo@exemplo.com
                    </li>
                    <li>
                        <strong className="color-brown">Telefone:</strong> (62) 9.9999-9999
                    </li>
                    <li>
                        <strong className="color-brown">Endereço:</strong> Rua Exemplo, 123 - Cidade, Estado
                    </li>
                    <li>
                        <strong className="color-brown">Data de Nascimento:</strong> 01/01/1990
                    </li>
                </ul>
            </div>

            <div className="mt-5">
                <h5 className="title-adm mb-4">Dados Profissionais</h5>
                <ul className="list-unstyled">
                    <li>
                        <strong className="color-brown">Formação:</strong> Agronomia
                    </li>
                    <li>
                        <strong className="color-brown">Data de Conclusão:</strong> 10/10/2022
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DadosPessoais;
