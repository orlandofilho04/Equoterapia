import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Agenda.css";
import SearchBar from "./SearchBar.js";
import DateNavigator from './DateNavigator.js';
import { Link } from 'react-router-dom';

function Agenda() {
    const [agendaData] = useState([
        { segunda: "08:00 - 09:00 | João Pedro Martins", terca: "08:00 - 09:00 | João Pedro Martins", quarta: "08:00 - 09:00 | Márcio da Silva", quinta: "08:00 - 09:00 | João Pedro Martins", sexta: "08:00 - 09:00 | Márcio da Silva" },
        { segunda: "09:00 - 10:00 | Márcio da Silva", terca: "", quarta: "09:00 - 10:00 | Carlos Batista dos Santos", quinta: "09:00 - 10:00 | César Abreu Pimenta", sexta: "09:00 - 10:00 | César Abreu Pimenta" },
        { segunda: "10:00 - 11:00 | Carlos Batista dos Santos", terca: "", quarta: "10:00 - 11:00 | Carlos Batista dos Santos", quinta: "", sexta: "" },
        { segunda: "11:00 - 12:00 | César Abreu Pimenta", terca: "", quarta: "", quinta: "", sexta: "" },
        { segunda: "", terca: "", quarta: "", quinta: "", sexta: "" },
        { segunda: "", terca: "", quarta: "", quinta: "", sexta: "" },
    ]);

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

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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
                <tbody className='text-center'>
                    {agendaData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {["segunda", "terca", "quarta", "quinta", "sexta"].map((day) => {
                                const session = row[day];
                                const [time, patient] = session ? session.split(" | ") : ["", ""];

                                return (
                                    <td key={day} className={session ? "session-cell" : "empty-cell"}>
                                        {session ? (
                                            <>
                                                <small>{time}</small>
                                                <div>{patient}</div>
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
