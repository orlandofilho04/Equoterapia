import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetalhesSessao from './DetalhesSessao';
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