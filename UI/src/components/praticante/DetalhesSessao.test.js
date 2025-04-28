import React, { useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import api from '../../services/api';

// Mock do módulo api
jest.mock('../../services/api');

const mockSessao = {
  condutor: 'João Silva',
  mediadores: ['Maria Santos', 'Pedro Oliveira'],
  encilhamento: 'Padrão',
  cavalo: 'Estrela',
  observacoes: 'Observações importantes da sessão'
};

const DetalhesSessao = () => {
  const { id } = useParams();
  const [sessao, setSessao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSessao = async () => {
      if (!id) {
        setError('ID da sessão não fornecido');
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando sessão com ID:', id);
        const response = await api.get(`/sessions/${id}`);
        console.log('Resposta da API:', response.data);
        setSessao(response.data);
      } catch (err) {
        console.error('Erro completo:', err);
        setError('Erro ao carregar detalhes da sessão');
      } finally {
        setLoading(false);
      }
    };

    fetchSessao();
  }, [id]);

  // ... resto do código
};

describe('DetalhesSessao', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve mostrar loading durante a requisição', () => {
    api.get.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/sessao/1']}>
        <Routes>
          <Route path="/sessao/:id" element={<DetalhesSessao />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir os detalhes da sessão quando carregados com sucesso', async () => {
    api.get.mockResolvedValueOnce({ data: mockSessao });

    render(
      <MemoryRouter initialEntries={['/sessao/1']}>
        <Routes>
          <Route path="/sessao/:id" element={<DetalhesSessao />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/João Silva/)).toBeInTheDocument();
      expect(screen.getByText(/Maria Santos, Pedro Oliveira/)).toBeInTheDocument();
      expect(screen.getByText(/Padrão/)).toBeInTheDocument();
      expect(screen.getByText(/Estrela/)).toBeInTheDocument();
      expect(screen.getByText(/Observações importantes da sessão/)).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro quando a requisição falha', async () => {
    api.get.mockRejectedValueOnce(new Error('Erro na API'));

    render(
      <MemoryRouter initialEntries={['/sessao/1']}>
        <Routes>
          <Route path="/sessao/:id" element={<DetalhesSessao />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar detalhes da sessão')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando a sessão não é encontrada', async () => {
    api.get.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter initialEntries={['/sessao/1']}>
        <Routes>
          <Route path="/sessao/:id" element={<DetalhesSessao />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sessão não encontrada')).toBeInTheDocument();
    });
  });
});