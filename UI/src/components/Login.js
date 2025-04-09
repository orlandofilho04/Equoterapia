import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "./imgs/icone.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/"); // troque para a rota desejada
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha incorretos");
    }
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
        </form>
      </div>
      <div className="login-image col-7"></div>
    </div>
  );
};

export default Login;
