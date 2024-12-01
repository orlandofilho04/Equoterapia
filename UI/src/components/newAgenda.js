import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './newAgenda.css';
import { Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NewAgenda() {
    return (
        <div className="container my-5">
            <div className='agendamento mb-4'>
                Novo Agendamento
            </div>
            <Form className='mx-2 mx-md-4 form'>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} sm={6} md={4} controlId="formGridPraticante" className='mb-3'>
                        <Form.Label>Selecione o Praticante</Form.Label>
                        <Form.Select defaultValue="Selecione um Praticante">
                            <option>Praticante</option>
                            <option>...</option>
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

                    <Form.Group as={Col} xs={12} md={6} className="mb-3" controlId="formGridCondutor">
                        <Form.Label>Condutor</Form.Label>
                        <Form.Control placeholder="Digite o nome do Condutor" />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
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
                </Row>

                <Row className='mb-3'>
                    <Form.Group controlId='formGridObs' className='mb-3'>
                        <Form.Label>Observações para a sessão</Form.Label>
                        <Form.Control placeholder='Observações gerais...' as="textarea" rows={5} />
                    </Form.Group>
                </Row>

                <Row className='mt-3'>
                    <div className='d-flex justify-content-end flex-wrap'>
                        <Link to="/" className='btnC btn mx-2' role="button" aria-pressed="true">
                            Cancelar
                        </Link>

                        <Link to="/" className='btnA btn mx-2' role="button" aria-pressed="true">
                            Agendar nova sessão
                        </Link>
                    </div>
                </Row>

            </Form>

        </div>
    );
}

export default NewAgenda;
