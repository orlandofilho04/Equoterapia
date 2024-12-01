import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DateNavigator.css'

function DateNavigator({ onDateChange }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
        if (onDateChange) onDateChange(newDate);
    };

    return (
        <div className="d-flex align-items-center justify-content-center my-3">
            <button className="btn btnN" onClick={() => changeDate(-1)}>
                <FaChevronLeft />
            </button>
            <span className="mx-3 text-dark">{formatDate(currentDate)}</span>
            <button className="btn btnN" onClick={() => changeDate(1)}>
                <FaChevronRight />
            </button>
        </div>
    );
}

export default DateNavigator;
