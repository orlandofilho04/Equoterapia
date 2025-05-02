import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Agenda.css";
import SearchBar from "./SearchBar.js";
import DateNavigator from './DateNavigator.js';
import api from "../services/api";
import { Link } from 'react-router-dom';
import FloatCard from './FloatCard.js';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Agenda() {
    const [agendaMap, setAgendaMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [showCard, setShowCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionError, setSessionError] = useState(false);

    // Função para calcular as datas da semana a partir de uma data específica
    const calculateWeekDates = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Início da semana (segunda-feira)
        
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            dates.push(currentDate);
        }
        return dates;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Atualiza as datas da semana e busca as sessões quando a data selecionada muda
    useEffect(() => {
        const week = calculateWeekDates(selectedDate);
        setWeekDates(week);

        const fetchSessions = async () => {
            try {
            const response = await api.get('/sessions');
            const fetchedSessions = response.data;
            const agenda = {};

            week.forEach((date) => {
                const dateStr = date.toISOString().split('T')[0];
                agenda[dateStr] = {};
            });

            fetchedSessions.forEach((session) => {
                const sessionDate = new Date(session.sessionHour);
                const dateStr = sessionDate.toISOString().split('T')[0];
                const hour = sessionDate.getHours().toString().padStart(2, '0') + ':00';

                if (agenda[dateStr]) {
                    agenda[dateStr][hour] ={
                        name: session.pacient?.name || "Paciente", 
                        status: session.sessionStatus || "AGENDADA"
                    };
                }
            });

            setAgendaMap(agenda);
            } catch (error) {
            console.error('Erro ao buscar sessões:', error);
            }
        };

        fetchSessions();
    }, [selectedDate]);

    // Gera os horários disponíveis (7h às 16h) podendo ser alterado para o que for necessário
    // Aqui, os horários são gerados de 7h às 16h (10 slots de 1 hora)
    const horarios = Array.from({ length: 10 }, (_, i) => {
        const hour = (7 + i).toString().padStart(2, '0');
        return `${hour}:00`;
    });

    // Função para lidar com a seleção de um paciente na barra de pesquisa
    const handlePacientSelect = async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/sessions?pacient_id=` + id);

            const orderedSessions = response.data.sort((a, b) => {
                return new Date(a.sessionHour) - new Date(b.sessionHour);
            });

            if (orderedSessions == null || orderedSessions.length === 0) {
                setSessionError(true);
                return;
            }
            setSessions(orderedSessions);
            setShowCard(true);
        } catch (err) {
            console.error("Erro ao buscar sessões:", err);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    bg="danger"
                    onClose={() => setSessionError(false)}
                    show={sessionError}
                    delay={3000}
                    autohide
                >
                <Toast.Body className="text-white texte-center">Nenhuma sessão foi encontrada para o paciente buscado.</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className='agenda mb-2'>
                Agenda
            </div>
            <div className='mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center'>
                <div className='mb-3 mb-md-0'>
                    <SearchBar onPacientSelect={handlePacientSelect}/>
                    {loading && <p>Carregando sessões...</p>}
                    {showCard && (
                        <FloatCard sessions={sessions} onClose={() => setShowCard(false)} />
                    )}
                </div>
                <div className='mb-3 mb-md-0'>
                    <DateNavigator onDateChange={handleDateChange} />
                </div>
                <Link to="/novo-agendamento" className='btnCad btn' role="button" aria-pressed="true">
                    Novo agendamento
                </Link>
            </div>

            <table className="table table-bordered rounded tb">
                <thead>
                    <tr>
                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((day, index) => (
                            <th key={day} className="th">
                                {day} 
                                <p className='sub'>
                                    {weekDates[index] ? `${weekDates[index].getDate()}/${weekDates[index].getMonth() + 1}` : "dia/mês"}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-center">
                    {horarios.map((horario) => (
                        <tr key={horario}>
                        {weekDates.map((date) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const sessao = agendaMap[dateStr]?.[horario];

                            let statusClass = "empty-cell";
                            let statusLabel = "";

                            // Verifica o status da sessão e define a classe e o rótulo apropriados
                            if (sessao) {
                                switch (sessao.status) {
                                    case "AGENDADA":
                                    statusClass = "session-agendada";
                                    statusLabel = "Agendado";
                                    break;
                                    case "CONCLUIDA":
                                    statusClass = "session-concluida";
                                    statusLabel = "Concluído";
                                    break;
                                    case "CANCELADA":
                                    statusClass = "session-cancelada";
                                    statusLabel = "Cancelado";
                                    break;
                                    default:
                                    statusClass = "session-agendada";
                                    statusLabel = "Agendada";
                                }
                            }

                            return (
                            <td key={dateStr + horario} className={statusClass}>
                                {sessao ? (
                                <>
                                    <small>{horario}</small>
                                    <div className='div-cell' title={sessao.name}>
                                        {sessao.name.length > 10 ? `${sessao.name.slice(0, 10)}...` : sessao.name}
                                    </div>
                                    <span className={`badge ${
                                        sessao.status === "AGENDADA" ? "bg-primary" :
                                        sessao.status === "CONCLUIDA" ? "bg-success" :
                                        "bg-danger"
                                        }`}>
                                        {statusLabel}
                                    </span>
                                </>
                                ) : (
                                <div>-</div>
                                )}
                            </td>
                            );
                        })}
                        </tr>
                    ))}
                    </tbody>
            </table>
        </div>
    );
}

export default Agenda;
