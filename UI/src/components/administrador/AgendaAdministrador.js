import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AgendaAdministrador.css';
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { api } from '../../services/api';

// Cores para diferentes equoterapeutas/sessões
const sessionColors = [
  '#30D0CA',  // Azul turquesa
  '#4CAF50',  // Verde
  '#E7A740',  // Laranja
  '#E74C3C',  // Vermelho
  '#9B2D20',  // Marrom
  '#8E44AD',  // Roxo
  '#2980B9',  // Azul
  '#F39C12',  // Amarelo
  '#16A085'   // Verde escuro
];

// Função para obter uma cor com base no nome do equoterapeuta
const getEquoterapeutaColor = (name) => {
  if (!name) return sessionColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return sessionColors[Math.abs(hash) % sessionColors.length];
};

const AgendaAdministrador = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDay, setCurrentDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  // Função para calcular as datas da semana
  const calculateWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Segunda-feira
    
    const dates = [];
    for (let i = 0; i < 5; i++) { // 5 dias úteis
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  // Atualizar datas da semana quando a data selecionada mudar
  useEffect(() => {
    const dates = calculateWeekDates(selectedDate);
    setWeekDates(dates);
    
    // Formatar a data atual para exibição (DD/MM/AA)
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear().toString().slice(-2);
    setCurrentDay(`${day}/${month}/${year}`);
  }, [selectedDate]);

  // Buscar sessões da API
  useEffect(() => {
    const fetchSessions = async () => {
      if (weekDates.length === 0) return;
      
      try {
        setLoading(true);
        
        // Obter a primeira e a última data da semana
        const startDate = weekDates[0];
        const endDate = weekDates[weekDates.length - 1];
        
        // Formatar datas para a API
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Buscar sessões na API
        const response = await api.get('/sessions', {
          params: {
            pacient_name: searchTerm || undefined
          }
        });
        
        // Filtrar sessões para a semana atual
        const filteredSessions = response.data.filter(session => {
          const sessionDate = new Date(session.sessionHour);
          const sessionDay = sessionDate.toISOString().split('T')[0];
          return sessionDay >= startDateStr && sessionDay <= endDateStr;
        });
        
        setSessions(filteredSessions);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar sessões:', err);
        setError('Erro ao carregar agenda. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [weekDates, searchTerm]);

  // Função para navegar entre semanas
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    const days = direction === 'prev' ? -7 : 7;
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Preparar dados da semana para exibição
  const weekViewData = weekDates.map(date => {
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + 
                 date.toLocaleString('pt-BR', { month: 'long' }).slice(1);
    
    const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][date.getDay()];
    
    return {
      date,
      dayStr: date.toISOString().split('T')[0],
      display: `${day}/${month}`,
      dayName
    };
  });

  // Definir horários para exibição na agenda
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00'
  ];

  // Encontrar uma sessão para um dia e horário específicos
  const findSessionsForTimeSlot = (dateStr, timeSlotStr) => {
    const [startHour] = timeSlotStr.split(' - ')[0].split(':');
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.sessionHour);
      const sessionDateStr = sessionDate.toISOString().split('T')[0];
      const sessionHour = sessionDate.getHours();
      
      return sessionDateStr === dateStr && sessionHour === parseInt(startHour);
    });
  };

  // Renderizar a tabela da agenda
  const renderAgendaTable = () => {
  if (loading) {
    return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
          </Spinner>
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

    return (
      <div 
        className="agenda-table"
        style={{ 
          border: '1px solid #e8e8e8',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <table className="table mb-0" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {weekViewData.map((dayData, index) => (
                <th 
                  key={dayData.dayStr} 
                  className="text-center py-3"
                  style={{ 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: index < weekViewData.length - 1 ? '1px solid #e8e8e8' : 'none',
                    background: '#ffffff' 
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{dayData.dayName}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{dayData.display}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, rowIndex) => (
              <tr key={timeSlot}>
                {weekViewData.map((dayData, colIndex) => {
                  const sessionsForSlot = findSessionsForTimeSlot(dayData.dayStr, timeSlot);
                  const hasSession = sessionsForSlot.length > 0;
                  const session = hasSession ? sessionsForSlot[0] : null;
                  
                  return (
                    <td 
                      key={`${dayData.dayStr}-${timeSlot}`}
                      className="p-0"
                      style={{ 
                        height: '80px',
                        borderBottom: rowIndex < timeSlots.length - 1 ? '1px solid #e8e8e8' : 'none',
                        borderRight: colIndex < weekViewData.length - 1 ? '1px solid #e8e8e8' : 'none',
                        position: 'relative',
                        verticalAlign: 'top'
                      }}
                    >
                      {session ? (
                        <div 
                          style={{
                            backgroundColor: getEquoterapeutaColor(session.professionals?.[0]?.name),
                            color: 'white',
                            height: '100%',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            fontSize: '14px'
                          }}
                        >
                          <div className="mb-1">{timeSlot}</div>
                          <div className="mb-1" style={{ fontWeight: 'bold' }}>
                            {session.pacient?.name || 'Paciente'}
                          </div>
                          <div>
                            Equoterapeuta: {session.professionals?.[0]?.name || 'Não definido'}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4" style={{ color: '#9B2D20', fontWeight: 'bold' }}>Agenda</h2>
      
      {/* Barra de pesquisa e navegação de data */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Procurar um Praticante"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: '8px',
              paddingLeft: '15px',
              paddingRight: '40px',
              height: '40px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
          <FaSearch 
            className="position-absolute"
            style={{
              right: '15px',
              top: '12px',
              color: '#999',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div className="d-flex align-items-center">
          <button
            className="btn"
            onClick={() => navigateWeek('prev')}
            style={{
              border: 'none', 
              background: 'transparent',
              color: '#666'
            }}
          >
            <FaChevronLeft />
          </button>
          
          <div 
            className="date-display mx-2"
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '6px 12px',
              fontWeight: '500',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            {currentDay}
          </div>
          
          <button
            className="btn"
            onClick={() => navigateWeek('next')}
            style={{
              border: 'none', 
              background: 'transparent',
              color: '#666'
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      
      {/* Tabela da agenda */}
      {renderAgendaTable()}
    </div>
  );
};

export default AgendaAdministrador;