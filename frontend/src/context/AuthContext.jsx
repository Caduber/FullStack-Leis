/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react';

const AuthContext = createContext(null);

const initialState = { user: null, token: null, loading: false, error: null };

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (username, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error?.message || data.errors?.[0]?.message || 'Erro ao fazer login.';
        dispatch({ type: 'SET_ERROR', payload: msg });
        return { success: false, errors: data.errors };
      }
      dispatch({ type: 'LOGIN', payload: data });
      return { success: true };
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Erro de conexão com o servidor.' });
      return { success: false };
    }
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error?.message || data.errors?.[0]?.message || 'Erro ao cadastrar.';
        dispatch({ type: 'SET_ERROR', payload: msg });
        return { success: false, errors: data.errors };
      }
      dispatch({ type: 'LOGIN', payload: data });
      return { success: true };
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Erro de conexão com o servidor.' });
      return { success: false };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
      });
    } catch {
      // ignore connection errors on logout
    }
    dispatch({ type: 'LOGOUT' });
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
