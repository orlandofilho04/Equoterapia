import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AgendaAdministrador.css';
import { Table, Alert, Form, Button } from 'react-bootstrap';
import { api } from '../../services/api';
import AdministradorLayout from './AdministradorLayout';

const AgendaAdministrador = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterId, setFilterId] = useState('');
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      // Alterando para o endpoint correto do backend
      const response = await api.get('/professional');
      // Filtrando apenas profissionais ativos no frontend, se necessário
      const activeProfessionals = response.data.filter(prof => !prof.archived);
      setProfessionals(activeProfessionals);
    } catch (err) {
      console.error('Erro ao buscar profissionais:', err);
    }
  };

  const calculateWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  useEffect(() => {
    setWeekDates(calculateWeekDates(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        let response;
        
        if (filterType === 'equitor' && filterId) {
          // Usando o endpoint correto para buscar sessões por equitador
          response = await api.get(`/equitors/schedules?equitor_id=${filterId}`);
        } else if (filterType === 'mediator' && filterId) {
          // Adaptando para usar o endpoint genérico de sessões, pois não existe endpoint específico para mediador
          response = await api.get(`/sessions`);
          const filteredData = response.data.filter(session => session.mediator && session.mediator.id === parseInt(filterId));
          response.data = filteredData;
        } else {
          response = await api.get('/sessions');
        }
        
        setSessions(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar sessões. Por favor, tente novamente.');
        console.error('Erro ao buscar sessões:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filterType, filterId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setFilterId(''); // Reset filter ID when changing type
  };

  const handleFilterIdChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await api.put(`/sessions/${sessionId}`, { sessionStatus: newStatus });
      setSessions(sessions.map(session => 
        session.id === sessionId 
          ? { ...session, sessionStatus: newStatus }
          : session
      ));
    } catch (err) {
      setError('Erro ao atualizar status da sessão. Por favor, tente novamente.');
      console.error('Erro ao atualizar status:', err);
    }
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
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

  const sessionsByDayAndTime = {};
  weekDates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    sessionsByDayAndTime[dateStr] = {};
  });

  sessions.forEach(session => {
    const dateStr = new Date(session.sessionHour).toISOString().split('T')[0];
    const timeStr = formatTime(session.sessionHour);
    if (!sessionsByDayAndTime[dateStr][timeStr]) {
      sessionsByDayAndTime[dateStr][timeStr] = [];
    }
    sessionsByDayAndTime[dateStr][timeStr].push(session);
  });

  const allTimes = new Set();
  sessions.forEach(session => {
    allTimes.add(formatTime(session.sessionHour));
  });
  const sortedTimes = Array.from(allTimes).sort();

  return (
    <AdministradorLayout>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="title-adm">Agenda</h2>
          <div className="d-flex gap-2">
            <Form.Select 
              value={filterType} 
              onChange={handleFilterChange}
              style={{ width: '200px' }}
            >
              <option value="all">Todas as Sessões</option>
              <option value="equitor">Por Equitador</option>
              <option value="mediator">Por Mediador</option>
            </Form.Select>
            
            {(filterType === 'equitor' || filterType === 'mediator') && (
              <Form.Select
                value={filterId}
                onChange={handleFilterIdChange}
                style={{ width: '200px' }}
              >
                <option value="">Selecione um {filterType === 'equitor' ? 'Equitador' : 'Mediador'}</option>
                {professionals
                  .filter(prof => prof.role.toLowerCase() === filterType)
                  .map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name}
                    </option>
                  ))}
              </Form.Select>
            )}
            
            <button
              className="btn btn-outline-primary"
              onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
            >
              Semana Anterior
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => handleDateChange(new Date())}
            >
              Hoje
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
            >
              Próxima Semana
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <Table bordered className="agenda-table">
            <thead>
              <tr>
                <th className="time-column">Horário</th>
                {weekDates.map((date, index) => (
                  <th key={index} className="day-column">
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTimes.map((time, timeIndex) => (
                <tr key={timeIndex}>
                  <td className="time-cell">{time}</td>
                  {weekDates.map((date, dateIndex) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const sessionsAtTime = sessionsByDayAndTime[dateStr][time] || [];
                    return (
                      <td key={dateIndex} className="session-cell">
                        {sessionsAtTime.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="session-item">
                            <div className="session-header">
                              <span className="session-time">{time}</span>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={`session-status ${session.sessionStatus.toLowerCase()}`}>
                                  {session.sessionStatus}
                                </span>
                                <div className="status-actions">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleStatusChange(session.id, 'CONFIRMED')}
                                    disabled={session.sessionStatus === 'CONFIRMED'}
                                  >
                                    Confirmar
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleStatusChange(session.id, 'CANCELLED')}
                                    disabled={session.sessionStatus === 'CANCELLED'}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="session-details">
                              <p className="mb-1"><strong>Praticante:</strong> {session.pacient.name}</p>
                              <p className="mb-1"><strong>Equoterapeuta:</strong> {session.professionals[0]?.name}</p>
                              <p className="mb-1"><strong>Equitador:</strong> {session.equitor.name}</p>
                              <p className="mb-1"><strong>Mediador:</strong> {session.mediator.name}</p>
                              <p className="mb-1"><strong>Cavalo:</strong> {session.equine.name}</p>
                              <p className="mb-1"><strong>Duração:</strong> {session.duration}</p>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </AdministradorLayout>
  );
};

export default AgendaAdministrador;