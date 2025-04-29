import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AgendaEquitador.css";
import SearchBar from "../SearchBar.js";
import DateNavigator from '../DateNavigator.js';
import { api } from '../../services/api';
import { Alert } from 'react-bootstrap';

function AgendaEquitador() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Atualiza a semana sempre que a data for alterada
    useEffect(() => {
        setWeekDates(calculateWeekDates(selectedDate));
    }, [selectedDate]);

    // Busca as sessões da API
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const startDate = weekDates[0];
                const endDate = weekDates[weekDates.length - 1];
                
                const response = await api.get('/sessions', {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        search: searchTerm
                    }
                });
                
                setSessions(response.data);
                setError(null);
            } catch (err) {
                setError('Erro ao carregar agenda. Por favor, tente novamente.');
                console.error('Erro ao buscar sessões:', err);
            } finally {
                setLoading(false);
            }
        };

        if (weekDates.length > 0) {
            fetchSessions();
        }
    }, [weekDates, searchTerm]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Organiza as sessões por dia e horário
    const organizedSessions = weekDates.reduce((acc, date) => {
        const dayKey = date.toISOString().split('T')[0];
        acc[dayKey] = sessions.filter(session => 
            new Date(session.date).toISOString().split('T')[0] === dayKey
        );
        return acc;
    }, {});

    return (
        <div className="container my-5">
            <div className='agenda-equitador mb-2'>
                Agenda Equitador
            </div>
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            <div className='mb-4 d-flex flex-column flex-md-row align-items-center'>
                <div className='mb-3 mb-md-0'>
                    <SearchBar onSearch={handleSearch} />  
                </div>
                <div className='mb-3 mb-md-0'>
                    <DateNavigator onDateChange={handleDateChange} />
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                <table className="table table-bordered rounded tb">
                    <thead>
                        <tr>
                            {weekDates.map((date, index) => (
                                <th key={date.toISOString()} className="th">
                                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"][index]}
                                    <p className='sub'>
                                        {`${date.getDate()}/${date.getMonth() + 1}`}
                                    </p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {Array.from({ length: 6 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {weekDates.map((date) => {
                                    const dayKey = date.toISOString().split('T')[0];
                                    const daySessions = organizedSessions[dayKey] || [];
                                    const session = daySessions[rowIndex];

                                    return (
                                        <td 
                                            key={dayKey} 
                                            className={session ? "session-cell" : "empty-cell"}
                                        >
                                            {session ? (
                                                <>
                                                    <small>{`${session.startTime} - ${session.endTime}`}</small>
                                                    <div>{session.patientName}</div>
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
            )}
        </div>
    );
}

export default AgendaEquitador;
