import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.setItem('authError', 'Acesso negado. Usuário não autenticado.');
        return false;
    }

    try {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        const now = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp < now) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.setItem('authError', 'Sessão expirada. Faça login novamente.');
            return false;
            }

        return true;
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.setItem('authError', 'Token inválido. Faça login novamente.');
            return false;
        }
};

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;