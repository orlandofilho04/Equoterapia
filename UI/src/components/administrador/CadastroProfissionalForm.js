import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import CadastroEquoterapeuta from './CadastroEquoterapeuta';
import CadastroEquitador from './CadastroEquitador';
import './CadastroProfissional.css';
import AdministradorLayout from './AdministradorLayout';

const CadastroProfissionalForm = () => {
    const [tipoSelecionado, setTipoSelecionado] = useState('');
    const [error, setError] = useState(null);

    const handleTipoChange = (e) => {
        setTipoSelecionado(e.target.value);
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <AdministradorLayout>
            <div className="cadastro-form-container">
                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

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

                {tipoSelecionado === 'equoterapeuta' && (
                    <CadastroEquoterapeuta 
                        initialRole={tipoSelecionado}
                        onError={handleError}
                        hideHeader={true}
                    />
                )}
                
                {tipoSelecionado === 'equitador' && (
                    <CadastroEquitador 
                        initialRole={tipoSelecionado}
                        onError={handleError}
                        hideHeader={true}
                    />
                )}
            </div>
        </AdministradorLayout>
    );
};

export default CadastroProfissionalForm;