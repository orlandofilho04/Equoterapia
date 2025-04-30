// CadastrarEquino.jsx

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CadastrarEquino.css';
import { Form, Row, Col, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../services/api";
import PlusIcon from '../imgs/addEquino.svg';


const CadastrarEquino = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [breed, setBreed] = useState('');
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [coatColor, setCoatColor] = useState('');
    const [specialsTraits, setspecialsTraits] = useState('');
    const [equipment, setEquipment] = useState('');
    const [gait, setGait] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);    

    const token = localStorage.getItem('token');    


    const handleCadastrarEquino = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const horseData = {
            name,
            registerCode: registerNumber,
            breed,
            gait,
            age,
            weight,
            height,
            coatColor,
            equipment,
            specialsTraits,
            sex,
            createdAt: new Date().toISOString()
        };

        // eslint-disable-next-line no-unused-vars
        const handleChange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
        
        
        
        try {
            await api.post('/horses', horseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/equitador/listar-equino');
            }, 2000);
        } catch (error) {
            console.error('Erro ao cadastrar equino:', error);
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast bg="success" onClose={() => setShowSuccess(false)} show={showSuccess} delay={2000} autohide>
                    <Toast.Body className="text-white text-center">
                        Equino cadastrado com sucesso!
                    </Toast.Body>
                </Toast>
                <Toast bg="danger" onClose={() => setShowError(false)} show={showError} delay={3000} autohide>
                    <Toast.Body className="text-white text-center">
                        Erro ao cadastrar o equino. Tente novamente.
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Form className="mx-2 mx-md-0 form" onSubmit={handleCadastrarEquino}>
                <div className="title mb-4">Cadastrar Novo Equino</div>

                <Row className="mb-3 mx-md-2 ps-1">
                    
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoNome" className="mb-3">
                        
                        <Form.Label>Nome do Equino</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do Animal"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridUploadImagem" className='mb-3'>
                        <div className="upload-container">
                            <input
                                type="file"
                                id="imageUpload"
                                name="photo"
                                accept="image/*"
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

                <div className="title mb-4">Identificação do Equino</div>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoRegis" className="mb-3">
                        <Form.Label>Número de registro</Form.Label>
                        <Form.Control
                            type="number"
                            value={registerNumber}
                            onChange={(e) => setRegisterNumber(e.target.value)}
                            placeholder="Digite o número do animal"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoRaca" className="mb-3">
                        <Form.Label>Raça</Form.Label>
                        <Form.Control
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            placeholder="Digite a raça animal"
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridSexo" className="mb-3">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select value={sex} onChange={(e) => setSex(e.target.value)}>
                            <option value="">Selecione o sexo</option>
                            <option value={0}>Masculino</option>
                            <option value={1}>Feminino</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridIdade" className="mb-3">
                        <Form.Label>Idade</Form.Label>
                        <Form.Select value={age} onChange={(e) => setAge(e.target.value)}>
                            <option value="">Selecione a idade</option>
                            {Array.from({ length: 30 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {`${index + 1} ano${index + 1 > 1 ? 's' : ''}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                <div className="title mb-4">Características Físicas</div>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoPeso" className="mb-3">
                        <Form.Label>Peso do Equino</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Digite o peso"
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoAltura" className="mb-3">
                        <Form.Label>Altura do Equino</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Digite a altura"
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoPelagem" className="mb-3">
                        <Form.Label>Cor da Pelagem</Form.Label>
                        <Form.Control
                            value={coatColor}
                            onChange={(e) => setCoatColor(e.target.value)}
                            placeholder="Digite a cor da pelagem"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={5} controlId="formGridEquinoObs" className="mb-3">
                        <Form.Label>Marcas ou características especiais</Form.Label>
                        <Form.Control
                            value={specialsTraits}
                            onChange={(e) => setspecialsTraits(e.target.value)}
                            placeholder="Adicione o seu texto aqui"
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={5} controlId="formGridEquinoGait" className="mb-3">
                        <Form.Label>Marcha (Galope, Trote, Passo...)</Form.Label>
                        <Form.Control
                            value={gait}
                            onChange={(e) => setGait(e.target.value)}
                            placeholder="Digite o tipo de andamento"
                            required
                        />
                    </Form.Group>
                </Row>

                <div className="title mb-4">Equipamentos</div>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={5} controlId="formGridEquinoEquipamento" className="mb-3">
                        <Form.Label>Equipamentos</Form.Label>
                        <Form.Control
                            value={equipment}
                            onChange={(e) => setEquipment(e.target.value)}
                            placeholder="Digite os equipamentos usados"
                            required
                        />
                    </Form.Group>

                    
                </Row>

                <Row className="mt-3">
                    <div className="d-flex justify-content-end flex-wrap">
                        <Link to="/equitador/listar-equino" className="btnB-equino btn mx-2" role="button" aria-pressed="true">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btnA-equino btn mx-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Cadastrando...
                                </>
                            ) : (
                                'Salvar Equino'
                            )}
                        </button>
                    </div>
                </Row>
            </Form>
        </div>
    );
};

export default CadastrarEquino;
