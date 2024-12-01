import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import CadastroProfissional1 from './CadastroProfissional1';
import CadastroEquitador from './CadastroEquitador';
import './CadastroProfissional.css';

const CadastroProfissionalForm = () => {
    const [tipoSelecionado, setTipoSelecionado] = useState('');

    const handleTipoChange = (e) => {
        setTipoSelecionado(e.target.value);
    };

    return (
        <div className="cadastro-form-container">
            <h2 className="cadastro-title mb-4">Cadastre um novo profissional</h2>
            
            <Form.Group className="mb-4">
                <Form.Label>Selecione o tipo de profissional</Form.Label>
                <Form.Select 
                    value={tipoSelecionado}
                    onChange={handleTipoChange}
                    className="input-field"
                >
                    <option value="">Selecione...</option>
                    <option value="equoterapeuta">Equoterapeuta</option>
                    <option value="equitador">Equitador</option>
                </Form.Select>
            </Form.Group>

            {tipoSelecionado === 'equoterapeuta' && <CadastroProfissional1 />}
            {tipoSelecionado === 'equitador' && <CadastroEquitador />}
        </div>
    );
};

export default CadastroProfissionalForm;