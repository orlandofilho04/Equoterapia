import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AgendaAdministrador.css';

const AgendaAdministrador = () => {
    const [currentDate] = useState(new Date("2024-10-07")); // Data fixa da imagem

    const formatDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
    };

    // Gera as datas da semana
    const getWeekDates = () => {
        const dates = [];
        const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            dates.push({
                day: weekDays[i],
                date: `${date.getDate()}/${months[date.getMonth()]}`
            });
        }
        return dates;
    };

    // Dados das sessões (como mostrado na imagem)
    const sessions = {
        "Segunda": [
            { time: "08:00 - 09:00", praticante: "João Pedro Martins", equoterapeuta: "João", color: "#30D0CA" },
            { time: "09:00 - 10:00", praticante: "Márcio da Silva", equoterapeuta: "Marta", color: "#07C158" },
            { time: "10:00 - 11:00", praticante: "Carlos Batista dos Santos", equoterapeuta: "Ana", color: "#CD853F" },
            { time: "11:00 - 12:00", praticante: "César Abreu Pimenta", equoterapeuta: "Miranda", color: "#DC3545" }
        ],
        "Terça": [
            { time: "08:00 - 09:00", praticante: "João Pedro Martins", equoterapeuta: "Mario", color: "#30D0CA" }
        ],
        "Quarta": [
            { time: "08:00 - 09:00", praticante: "Márcio da Silva", equoterapeuta: "Jorge", color: "#07C158" },
            { time: "09:00 - 10:00", praticante: "Carlos Batista dos Santos", equoterapeuta: "Pedro", color: "#CD853F" },
            { time: "10:00 - 11:00", praticante: "Carlos Batista dos Santos", equoterapeuta: "Ana", color: "#CD853F" }
        ],
        "Quinta": [
            { time: "08:00 - 09:00", praticante: "João Pedro Martins", equoterapeuta: "Pedro", color: "#30D0CA" },
            { time: "09:00 - 10:00", praticante: "César Abreu Pimenta", equoterapeuta: "Jorge", color: "#DC3545" }
        ],
        "Sexta": [
            { time: "08:00 - 09:00", praticante: "Márcio da Silva", equoterapeuta: "Mario", color: "#07C158" },
            { time: "09:00 - 10:00", praticante: "César Abreu Pimenta", equoterapeuta: "João", color: "#DC3545" }
        ]
    };

    const weekDates = getWeekDates();

    return (
        <div className="container my-5">
            <div className='agenda-title mb-4'>
                Agenda
            </div>

            <div className='d-flex justify-content-between align-items-center mb-4'>
                {/* Barra de pesquisa */}
                <div className='search-container'>
                    <InputGroup>
                        <InputGroup.Text className="search-icon">
                            <FaSearch color="white" />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Procurar um Praticante"
                            className="search-input"
                        />
                    </InputGroup>
                </div>

                {/* Navegador de data */}
                <div className="date-navigator d-flex align-items-center">
                    <button className="btn btn-nav">
                        <FaChevronLeft />
                    </button>
                    <span className="mx-3">{formatDate(currentDate)}</span>
                    <button className="btn btn-nav">
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            {/* Tabela da agenda */}
            <div className="agenda-table">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {weekDates.map((item, index) => (
                                <th key={index}>
                                    {item.day}<br/>{item.date}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {weekDates.map((item, colIndex) => {
                                    const session = sessions[item.day]?.[rowIndex];
                                    return (
                                        <td 
                                            key={colIndex} 
                                            className={session ? "session-cell" : "empty-cell"}
                                            style={session ? { backgroundColor: session.color } : {}}
                                        >
                                            {session && (
                                                <>
                                                    <div className="session-time">{session.time}</div>
                                                    <div className="session-praticante">{session.praticante}</div>
                                                    <div className="session-equoterapeuta">Equoterapeuta: {session.equoterapeuta}</div>
                                                </>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgendaAdministrador;