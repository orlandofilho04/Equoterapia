import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./imgs/icone.png";
import "./Login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/codigo-verificacao");
  };

  return (
    <div className="login-container d-flex">
      <div className="login-form col-5 d-flex flex-column align-items-center justify-content-center">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h2 className="font-weight-bold">Recuperar Senha</h2>
        <p className="text-center" id="texto">
          Vamos ajuda-lo nisso! Primeiro, digite seu usuário cadastrado.
        </p>
        <form className="w-75 mt-3" onSubmit={handleSubmit}>
          <div className="mb-3 text-start w-100">
            <label htmlFor="user" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              id="user"
              className="form-control input-field"
              placeholder="Digite seu usuário"
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            Enviar Código de Recuperação
          </button>
        </form>
      </div>
      <div className="login-image col-7"></div>
    </div>
  );
};

export default ForgotPassword;
