import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "./imgs/icone.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="login-container d-flex">
      <div className="login-form col-5 d-flex flex-column align-items-center justify-content-center">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h2 className="font-weight-bold">Acesse sua Conta</h2>
        <form onSubmit={handleLogin} className="w-75 mt-3">
          <div className="mb-3 text-start w-100">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              className="form-control input-field"
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="mb-3 text-start w-100 position-relative">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control input-field pr-5"
              placeholder="Digite sua senha"
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="text-end mb-3">
            <Link to="/esqueceu-senha" className="btn btn-link">
              Esqueceu sua senha?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            Entrar
          </button>
          {/* Link temporário, apenas para ter acesso às telas */}
          <div className="text-center mt-3">
            <Link to="/equitador/" className="btn btn-link">
              Ir para telas do Equitador
            </Link>
          </div>
        </form>
      </div>
      <div className="login-image col-7"></div>
    </div>
  );
};

export default Login;
