import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Agenda.css";
import SearchBar from "./SearchBar.js";
import DateNavigator from './DateNavigator.js';
import api from "../services/api";
import { Link } from 'react-router-dom';

function Agenda() {
    const [agendaMap, setAgendaMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);

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

    return (
        <div className="container my-5">
            <div className='agenda mb-2'>
                Agenda
            </div>
            <div className='mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center'>
                <div className='mb-3 mb-md-0'>
                    <SearchBar />  
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
