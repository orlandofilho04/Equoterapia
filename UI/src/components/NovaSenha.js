import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "./imgs/icone.png";
import "./Login.css";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    <div className="login-container d-flex">
      <div className="login-form col-5 d-flex flex-column align-items-center justify-content-center">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h2 className="font-weight-bold">Redefinir Senha</h2>
        <p className="text-center" id="texto">
          Insira sua nova senha abaixo.
        </p>
        <form onSubmit={handleSubmit} className="w-75 mt-3">
          <div className="mb-3 text-start w-100 position-relative">
            <label htmlFor="newPassword" className="form-label">
              Nova Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              className="form-control input-field"
              placeholder="Digite sua nova senha"
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-3 text-start w-100 position-relative">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Nova Senha
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="form-control input-field"
              placeholder="Confirme sua nova senha"
            />
            <span
              className="eye-icon"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <br />
          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            Redefinir Senha
          </button>
        </form>
      </div>
      <div className="login-image col-7"></div>
    </div>
  );
};

export default ResetPassword;
