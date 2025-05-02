import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";
import "./SearchBar.css";

function SearchBar({ className = "", onPacientSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [pacients, setPacients] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        api.get("/pacients")
            .then(res => setPacients(res.data))
            .catch(err => console.error("Erro ao buscar praticantes:", err));
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filteredList = pacients.filter(p =>
            p.name.toLowerCase().includes(term)
        );
        setFiltered(filteredList);
    }, [searchTerm, pacients]);

    const handleSelect = (pacient) => {
        if (!pacient) return;
        setSearchTerm("");
        setFiltered([]);
        if (onPacientSelect) onPacientSelect(pacient.id);
        document.activeElement.blur();
    };

    return (
        <div className={`container position-relative ${className}`}>
            <div className="inputGroup searche-bar">
                <span className="search-icone" id="basic-addon1">
                    <svg width="16" height="16" viewBox="0 0 20 20">
                        <path
                            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                            stroke="currentColor"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <input
                    type="text"
                    className="form-control searche-input"
                    placeholder="Procurar um Praticante"
                    aria-label="Procurar um Praticante"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setTimeout(() => setFiltered([]), 100)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filtered.length > 0) {
                            handleSelect(filtered[0]);
                        }
                    }}
                />
            </div>

            {filtered.length > 0 && searchTerm && (
                <ul className="list-group position-absolute w-100 zindex-tooltip shadow-sm mt-0 mb-0 bg-white rounded">
                    {filtered.map(p => (
                        <li
                            key={p.id}
                            className="list-group-item list-group-item-action mb-0 rounded-0"
                            onClick={() => handleSelect(p)}
                            style={{ cursor: "pointer" }}
                        >
                            {p.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
