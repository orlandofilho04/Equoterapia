import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import './newAgenda.css';
import { Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';


function NewAgenda() {
    const navigate = useNavigate();
    const [professional_id, setProfessionalId] = useState(null);
    const [pacients, setPacients] = useState([]);
    const [selectedPacientId, setSelectedPacientId] = useState(null);
    const [horsers, setHorses] = useState([]);
    const [selectedHorseId, setSelectedHorseId] = useState(null);
    const [equitors, setEquitors] = useState([]);
    const [selectedEquitorId, setSelectedEquitorId] = useState(null);
    const [mediators, setMediators] = useState([]);
    const [selectedMediatorId, setSelectedMediatorId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [sessions, setSessions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [dateError, setDateError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const today = new Date();
   const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    
    // BUSCAR SESSÕES AGENDADAS
    useEffect(() => {
        const fetchSessions = async () => {
            try {
            const response = await api.get('/sessions');
            setSessions(response.data);
            } catch (error) {
            console.error('Erro ao buscar sessões:', error);
            }
        };
        fetchSessions();
    }, []);

    // BUSCAR PROFISSIONAL LOGADO
    // (OBTER O ID DO PROFISSIONAL LOGADO)
    useEffect(() => {
        if (username) {
            api.get('/professional/?username=' + username)
            .then(response => setProfessionalId(response.data.id))
            .catch(error => console.error('Erro ao buscar profissional:', error));
        }
    }, [username]);

    // BUSCAR PACIENTES, EQUITADORES, CAVALOS E MEDIADORES
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, eRes, hRes, mRes] = await Promise.all([
                    api.get('/pacients'),
                    api.get('/professional/role?role=EQUITADOR'),
                    api.get('/horses'),
                    api.get('/professional/role?role=MEDIADOR')
                ]);

                setPacients(pRes.data);
                setEquitors(eRes.data);
                setHorses(hRes.data);
                setMediators(mRes.data);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
            }
        };

        fetchData();
    }, []);

    // FUNÇÃO PARA CRIAR O AGENDAMENTO
    // (ENVIAR DADOS PARA O BACKEND)
    const handleAgendamento = async (event) => {
        event.preventDefault();

        const sessionData = {
            sessionHour: `${selectedDate}T${selectedTime}:00`,
            duration: "01:00:00",
            sessionStatus: "AGENDADA",
        };

        const params = new URLSearchParams({
            pacient_id: selectedPacientId,
            horse_id: selectedHorseId,
            professional_id: professional_id,
            equitor_id: selectedEquitorId,
            mediator_id: selectedMediatorId
        }).toString();

        setIsSubmitting(true);

        try {
            await api.post(
                `/sessions/registerSession?${params}`,
                sessionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/agenda-geral');
            }, 2000); // espera 2 segundos antes de navegar
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // FUNÇÕES PARA SELECIONAR PACIENTE, EQUITADOR, CAVALO E MEDIADOR
    // (ATUALIZAR O ESTADO COM O ID SELECIONADO)
    const handleSelectPacient = (event) => {
        setSelectedPacientId(Number(event.target.value));
    };

    const handleSelectEquitor = (event) => {
        setSelectedEquitorId(Number(event.target.value));
    };

    const handleSelectHorse = (event) => {
        setSelectedHorseId(Number(event.target.value));
    }

    const handleSelectMediator = (event) => {
        setSelectedMediatorId(Number(event.target.value));
    }

    // FUNÇÃO PARA OBTER HORÁRIOS DISPONÍVEIS
    // (FILTRAR HORÁRIOS OCUPADOS E RETORNAR OS DISPONÍVEIS)
    const getAvailableHours = () => {
        if (!selectedDate) return [];

        const busyHours = sessions
            .filter((s) => s.sessionHour.startsWith(selectedDate))
            .map((s) => new Date(s.sessionHour).getHours());

        const hours = [];
        for (let h = 7; h <= 16; h++) {
            if (!busyHours.includes(h)) {
            const hour = h.toString().padStart(2, '0');
            hours.push(`${hour}:00`);
            }
        }

        return hours;
    };

    return (
        <div className="container my-5 p-4 rounded shadow-sm bg-white">
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    bg="success"
                    onClose={() => setShowSuccess(false)}
                    show={showSuccess}
                    delay={2000}
                    autohide
                >
                    <Toast.Body className="text-white text-center">Agendamento criado com sucesso!</Toast.Body>
                </Toast>

                <Toast
                    bg="danger"
                    onClose={() => setShowError(false)}
                    show={showError}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className="text-white texte-center">Erro ao criar agendamento. Verifique os campos.</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className='agendamento mb-4'>
                Novo Agendamento
            </div>
            <Form className='mx-2 mx-md-4 form' onSubmit={handleAgendamento}>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} sm={6} md={4} controlId="formGridPraticante" className='mb-3'>
                        <Form.Label>Praticante</Form.Label>
                        <Form.Select onChange={handleSelectPacient}>
                            <option value="" disabled selected>Selecione um Praticante</option>
                            {pacients.filter(p => p.status === "ATIVO").map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} sm={6} md={4} controlId="formGridDatas" className='mb-3'>
                        <Form.Label>Datas Disponíveis</Form.Label>
                        {/*<Form.Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                            <option value="">Selecione uma Data</option>
                            {weekdays.map((date) => (
                            <option key={date} value={date}>{date}</option>
                            ))}
                        </Form.Select>*/}
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            min={localDate}
                            onChange={(e) => {
                                const inputDate = e.target.value;
                                const selected = new Date(inputDate + 'T00:00:00');
                                const day = selected.getDay();

                                const now = new Date();
                                const selectedIsToday = inputDate === localDate;

                                if (day === 0 || day === 6) {
                                    setDateError('Erro ao selecionar data. Fins de semana não são permitidos.');
                                    setSelectedDate('');
                                    return;
                                }

                                if (selectedIsToday && now.getHours() >= 17) {
                                    setDateError('Erro: Não é possível agendar após as 17h.');
                                    setSelectedDate('');
                                    return;
                                }

                                setDateError('');
                                setSelectedDate(inputDate);
                            }}
                        />
                            {dateError && (
                            <Form.Text className="text-danger">
                                {dateError}
                            </Form.Text>
                            )}
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridHorarios" className='mb-3'>
                        <Form.Label>Horários Disponíveis</Form.Label>
                        <Form.Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} disabled={!selectedDate}>
                            <option value="" disabled selected>Selecione um Horário</option>
                            {getAvailableHours().map((hour) => (
                            <option key={hour} value={hour}>{hour}</option>
                            ))}
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
                            <option value="" disabled selected>Selecione um Equitador</option>
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
                            <option value="" disabled selected>Selecione um Animal</option>
                            {horsers.filter(horse => horse.status === "ATIVO").map((horse) => (
                                <option key={horse.id} value={horse.id}>
                                    {horse.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={4} controlId="formGridMediator" className='mb-3'>
                        <Form.Label>Mediador</Form.Label>
                        <Form.Select onChange={handleSelectMediator}>
                            <option value="">Selecione um Mediador</option>
                            {mediators.map((mediator) => (
                                <option key={mediator.id} value={mediator.id}>
                                    {mediator.name}
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
                        <Link to="/agenda-geral" className='btnB btn mx-2' aria-pressed="true">
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="btnA btn mx-2"
                            disabled={
                                !selectedPacientId ||
                                !selectedHorseId ||
                                !selectedEquitorId ||
                                !selectedMediatorId ||
                                !selectedDate ||
                                !selectedTime ||
                                isSubmitting
                            }
                            >
                            {isSubmitting ? (
                                <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Agendando...
                                </>
                            ) : (
                                'Agendar nova sessão'
                            )}
                        </button>
                    </div>
                </Row>

            </Form>

        </div>
    );
}

export default NewAgenda;