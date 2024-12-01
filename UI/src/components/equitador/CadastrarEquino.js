import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CadastrarEquino.css';
import { Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlusIcon from '../imgs/addEquino.svg';

const CadastrarEquino = () => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='container my-5'>
            <Form className='mx-2 mx-md-0 form'>
            <div className='title mb-4'>Cadastrar Novo Equino</div>
                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoNome" className='mb-3'>
                        <Form.Label>Nome do Equino</Form.Label>
                        <Form.Control placeholder="Digite o nome do Animal" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridUploadImagem" className='mb-3'>
                        <div className="upload-container">
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="image-input"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="imageUpload" className="image-upload-label">
                                {preview ? (
                                    <img src={preview} alt="Pré-visualização" className="image-preview" />
                                ) : (
                                    <div className="placeholder">
                                        <img src={PlusIcon} alt="Adicionar" />
                                    </div>
                                )}
                                <span className="add-icon">+</span>
                            </label>
                        </div>
                    </Form.Group>
                </Row>

                <div className='title mb-4'>Identificação do Equino</div>
                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoRegis" className='mb-3'>
                        <Form.Label>Número de registro</Form.Label>
                        <Form.Control type="number" placeholder="Digite o número do animal" />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoRaca" className='mb-3'>
                        <Form.Label>Raça</Form.Label>
                        <Form.Control placeholder="Digite a raça animal" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridSexo" className='mb-3'>
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select defaultValue="Selecione o sexo">
                            <option>Masculino</option>
                            <option>Feminino</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridIdade" className='mb-3'>
                        <Form.Label>Idade</Form.Label>
                        <Form.Select defaultValue="Selecione a Idade">
                            <option disabled>Selecione a Idade</option>
                            {Array.from({ length: 30 }, (_, index) => (
                                <option key={index + 1}>{`${index + 1} ano${index + 1 > 1 ? 's' : ''}`}</option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                <div className='title mb-4'>Características Físicas</div>
                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoPeso" className='mb-3'>
                        <Form.Label>Peso do Equino</Form.Label>
                        <Form.Control type="number" step="0.1" placeholder="Digite o peso" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoAltura" className='mb-3'>
                        <Form.Label>Altura do Equino</Form.Label>
                        <Form.Control type="number" step="0.1" placeholder="Digite a altura" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoPelagem" className='mb-3'>
                        <Form.Label>Cor da Pelagem</Form.Label>
                        <Form.Control placeholder="Digite a cor da pelagem" />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={5} controlId="formGridEquinoObs" className='mb-3'>
                        <Form.Label>Marcas ou características especiais</Form.Label>
                        <Form.Control placeholder="Adicione o seu texto aqui" />
                    </Form.Group>
                </Row>

                <Row className='mt-3'>
                    <div className='d-flex justify-content-end flex-wrap'>
                        <Link to="/equitador/listar-equino" className='btnC btn mx-2' role="button" aria-pressed="true">
                            Cancelar
                        </Link>
                        <Link to="/equitador/listar-equino" className='btnA btn mx-2' role="button" aria-pressed="true">
                            Salvar Equino
                        </Link>
                    </div>
                </Row>
            </Form>
        </div>
    );
};

export default CadastrarEquino;
