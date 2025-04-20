import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchBar.css";

function SearchBar({ className = "" }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className={`container ${className}`}>
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
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
}

export default SearchBar;
