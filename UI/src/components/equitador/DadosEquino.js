import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DadosEquino.css';
import { Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function DadosEquino({ match }) {
    const [equine, setEquine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchEquine = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/horses/${match.params.id}`);
                setEquine(response.data);
                setFormData(response.data);
                setError(null);
            } catch (err) {
                setError('Erro ao carregar dados do equino. Por favor, tente novamente.');
                console.error('Erro ao buscar equino:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEquine();
    }, [match.params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.put(`/horses/${match.params.id}`, formData);
            setEquine(formData);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError('Erro ao atualizar dados do equino. Por favor, tente novamente.');
            console.error('Erro ao atualizar equino:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                {error}
            </Alert>
        );
    }

    if (!equine) {
        return (
            <Alert variant="warning">
                Equino não encontrado.
            </Alert>
        );
    }

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

            <div className="dados-equino mb-4">
                Dados do Equino
            </div>
            
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Número de Registro</label>
                        <input
                            type="text"
                            className="form-control"
                            name="registrationNumber"
                            value={formData.registrationNumber || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Raça</label>
                        <input
                            type="text"
                            className="form-control"
                            name="breed"
                            value={formData.breed || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Sexo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Idade</label>
                        <input
                            type="number"
                            className="form-control"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Peso (kg)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="weight"
                            value={formData.weight || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Altura (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="height"
                            value={formData.height || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Cor do Pelo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="coatColor"
                            value={formData.coatColor || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Marcas Especiais</label>
                    <textarea
                        className="form-control"
                        name="specialMarks"
                        value={formData.specialMarks || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                    />
                </div>

                <div className="d-flex justify-content-end gap-2">
                    {!isEditing ? (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Editar
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData(equine);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

export default DadosEquino;
