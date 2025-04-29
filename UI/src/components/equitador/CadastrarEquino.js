import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CadastrarEquino.css';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import PlusIcon from '../imgs/addEquino.svg';

const CadastrarEquino = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        breed: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        coatColor: '',
        specialMarks: '',
        photo: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData(prev => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            await api.post('/horses', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/equitador/listar-equino');
        } catch (err) {
            setError('Erro ao cadastrar equino. Por favor, tente novamente.');
            console.error('Erro ao cadastrar equino:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container my-5'>
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            <Form className='mx-2 mx-md-0 form' onSubmit={handleSubmit}>
                <div className='title mb-4'>Cadastrar Novo Equino</div>
                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoNome" className='mb-3'>
                        <Form.Label>Nome do Equino</Form.Label>
                        <Form.Control 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
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
                                onChange={handleChange}
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
                        <Form.Control 
                            type="text"
                            name="registerNumber"
                            value={formData.registerNumber}
                            onChange={handleChange}
                            placeholder="Digite o número do animal"
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoRaca" className='mb-3'>
                        <Form.Label>Raça</Form.Label>
                        <Form.Control 
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            placeholder="Digite a raça animal"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridSexo" className='mb-3'>
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select 
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formGridIdade" className='mb-3'>
                        <Form.Label>Idade</Form.Label>
                        <Form.Select 
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione a Idade</option>
                            {Array.from({ length: 30 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {`${index + 1} ano${index + 1 > 1 ? 's' : ''}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                <div className='title mb-4'>Características Físicas</div>
                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoPeso" className='mb-3'>
                        <Form.Label>Peso do Equino</Form.Label>
                        <Form.Control 
                            type="number" 
                            step="0.1"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="Digite o peso"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEquinoAltura" className='mb-3'>
                        <Form.Label>Altura do Equino</Form.Label>
                        <Form.Control 
                            type="number" 
                            step="0.1"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="Digite a altura"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridEquinoPelagem" className='mb-3'>
                        <Form.Label>Cor da Pelagem</Form.Label>
                        <Form.Control 
                            name="coatColor"
                            value={formData.coatColor}
                            onChange={handleChange}
                            placeholder="Digite a cor da pelagem"
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3 mx-md-2 ps-1">
                    <Form.Group as={Col} xs={12} md={5} controlId="formGridEquinoObs" className='mb-3'>
                        <Form.Label>Marcas ou características especiais</Form.Label>
                        <Form.Control 
                            name="specialMarks"
                            value={formData.specialMarks}
                            onChange={handleChange}
                            placeholder="Adicione o seu texto aqui"
                        />
                    </Form.Group>
                </Row>

                <Row className='mt-3'>
                    <div className='d-flex justify-content-end flex-wrap'>
                        <Link 
                            to="/equitador/listar-equino" 
                            className='btnC btn mx-2' 
                            role="button" 
                            aria-pressed="true"
                            disabled={loading}
                        >
                            Cancelar
                        </Link>
                        <button 
                            type="submit"
                            className='btnA btn mx-2' 
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Equino'}
                        </button>
                    </div>
                </Row>
            </Form>
        </div>
    );
};

export default CadastrarEquino;
