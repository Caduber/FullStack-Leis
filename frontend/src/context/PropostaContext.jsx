/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react';

const PropostaContext = createContext(null);

const initialState = { resultados: [], loading: false, error: null };

function propostaReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_RESULTADOS':
      return { ...state, resultados: action.payload, loading: false };
    case 'SET_ERRO':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function PropostaProvider({ children }) {
  const [state, dispatch] = useReducer(propostaReducer, initialState);

  const search = useCallback(async (keyword, token) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await fetch(`/api/propostas?keyword=${encodeURIComponent(keyword)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: 'SET_ERRO', payload: data.error?.message || 'Erro ao buscar propostas.' });
        return;
      }
      dispatch({ type: 'SET_RESULTADOS', payload: data.resultados });
    } catch {
      dispatch({ type: 'SET_ERRO', payload: 'Erro de conexão com o servidor.' });
    }
  }, []);

  const fetchAll = useCallback(async (token) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await fetch('/api/propostas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: 'SET_ERRO', payload: data.error?.message || 'Erro ao carregar propostas.' });
        return;
      }
      dispatch({ type: 'SET_RESULTADOS', payload: data.resultados });
    } catch {
      dispatch({ type: 'SET_ERRO', payload: 'Erro de conexão com o servidor.' });
    }
  }, []);

  return (
    <PropostaContext.Provider value={{ state, search, fetchAll }}>
      {children}
    </PropostaContext.Provider>
  );
}

export function useProposta() {
  const ctx = useContext(PropostaContext);
  if (!ctx) throw new Error('useProposta must be used within PropostaProvider');
  return ctx;
}
