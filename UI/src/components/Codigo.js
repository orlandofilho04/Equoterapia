import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./imgs/icone.png";
import "./Login.css";

const VerificationCode = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/nova-senha");
  };

  return (
    <div className="login-container d-flex">
      <div className="login-form col-5 d-flex flex-column align-items-center justify-content-center">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h2 className="font-weight-bold">Verificação de Código</h2>
        <p className="text-center" id="texto">
          Insira o código de verificação enviado ao seu e-mail.
        </p>
        <form onSubmit={handleSubmit} className="w-75 mt-3">
          <div className="mb-3 text-start w-100">
            <label htmlFor="code" className="form-label">
              Código de Verificação
            </label>
            <input
              type="text"
              id="code"
              className="form-control input-field"
              placeholder="Digite o código"
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            Confirmar Código
          </button>
        </form>
      </div>
      <div className="login-image col-7"></div>
    </div>
  );
};

export default VerificationCode;
