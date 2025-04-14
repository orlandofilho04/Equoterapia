import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './newAgenda.css';
import { Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from "../services/api";

function NewAgenda() {
    const [pacients, setPacients] = useState([]);
    const [selectedPacientId, setSelectedPacientId] = useState(null);
    const [horsers, setHorses] = useState([]);
    const [selectedHorseId, setSelectedHorseId] = useState(null);
    const [equitors, setEquitors] = useState([]);
    const [selectedEquitorId, setSelectedEquitorId] = useState(null);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        api.get('/pacients')
        .then(response => {
            setPacients(response.data);
            console.log(localStorage.getItem('token'));
            console.log('ID do praticante selecionado:', username);
        })
        .catch(error => {
            console.error('Erro ao buscar pacientes:', error);
        });
    }, []);

    useEffect(() => {
        api.get('/equitors')
        .then(response => {
            setEquitors(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar equitadores:', error);
        });
    }, []);

    useEffect(() => {
        api.get('/horses')
        .then(response => {
            setHorses(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar cavalos:', error);
        });
    }, []);

    const handleAgendamento = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/sessions/registerSession', {
                pacient_id: selectedPacientId,
                horse_id: selectedHorseId,
                professional_id: proId,
                equitor_id: selectedEquitorId,
                sessionHour: "2025-12-03T10:15:30",
                duration: "01:30:10",
                sessionStatus: "AGENDADA",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Agendamento criado com sucesso!");
            navigate('/'); // ou redirect para onde quiser
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            alert("Erro ao criar agendamento. Verifique os campos e tente novamente.");
        }
    };

    const handleSelectPacient = (event) => {
        const idPacient = event.target.value;
        setSelectedPacientId(idPacient);
    };

    const handleSelectEquitor = (event) => {
        const idEquitor = event.target.value;
        setSelectedEquitorId(idEquitor);
    };

    const handleSelectHorse = (event) => {
        const idHorse = event.target.value;
        setSelectedHorseId(idHorse);
    }

    return (
        <div className="container my-5">
            <div className='agendamento mb-4'>
                Novo Agendamento
            </div>
            <Form className='mx-2 mx-md-4 form' onSubmit={handleAgendamento}>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} sm={6} md={4} controlId="formGridPraticante" className='mb-3'>
                        <Form.Label>Praticante</Form.Label>
                        <Form.Select onChange={handleSelectPacient}>
                            <option value="">Slecione um Praticante</option>
                            {pacients.map((pacient) => (
                                <option key={pacient.id} value={pacient.id}>
                                    {pacient.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={4} controlId="formGridDatas" className='mb-3'>
                        <Form.Label>Datas Disponíveis</Form.Label>
                        <Form.Select defaultValue="Selecione uma Data">
                            <option>00/00/00</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridHorarios" className='mb-3'>
                        <Form.Label>Horários Disponíveis</Form.Label>
                        <Form.Select defaultValue="Selecione um Horário">
                            <option>00:00 - 00:00</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>

                    {/*<Form.Group as={Col} xs={12} md={6} className="mb-3" controlId="formGridCondutor">
                        <Form.Label>Condutor</Form.Label>
                        <Form.Control placeholder="Digite o nome do Condutor" />
                    </Form.Group>*/}
                </Row>

                <Row className='mb-3'>
                    <Form.Group as={Col} xs={12} md={4} className="mb-3" controlId="formGridEquitor">
                        <Form.Label>Equitador</Form.Label>
                        <Form.Select onChange={handleSelectEquitor}>
                            <option value="">Slecione um Equitador</option>
                            {equitors.map((equitor) => (
                                <option key={equitor.id} value={equitor.id}>
                                    {equitor.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridCavalo" className='mb-3'>
                        <Form.Label>Cavalo</Form.Label>
                        <Form.Select onChange={handleSelectHorse}>
                            <option value="">Slecione um Animal</option>
                            {horsers.map((horse) => (
                                <option key={horse.id} value={horse.id}>
                                    {horse.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                {/*<Row className="mb-3">
                    <Form.Group as={Col} xs={12} md={6} controlId="formGridMediador" className='mb-3'>
                        <Form.Label>Mediador (es)</Form.Label>
                        <Form.Control placeholder="Digite o nome do Mediador" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={3} controlId="formGridEncilhamento" className='mb-3'>
                        <Form.Label>Encilhamento</Form.Label>
                        <Form.Select defaultValue="Selecione o encilhamento utilizado">
                            <option>Equipamento 1</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={3} controlId="formGridCavalo" className='mb-3'>
                        <Form.Label>Cavalo</Form.Label>
                        <Form.Select defaultValue="Selecione o animal a utilizar">
                            <option>Cavalo 1</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>
                </Row>*/}

                <Row className='mb-3'>
                    <Form.Group controlId='formGridObs' className='mb-3'>
                        <Form.Label>Observações para a sessão</Form.Label>
                        <Form.Control placeholder='Observações gerais...' as="textarea" rows={5} />
                    </Form.Group>
                </Row>

                <Row className='mt-3'>
                    <div className='d-flex justify-content-end flex-wrap'>
                        <Link to="/" className='btnB btn mx-2' role="button" aria-pressed="true">
                            Cancelar
                        </Link>

                        <button type="submit" className='btnA btn mx-2' role="button" aria-pressed="true">
                            Agendar nova sessão
                        </button>
                    </div>
                </Row>

            </Form>

        </div>
    );
}

export default NewAgenda;
