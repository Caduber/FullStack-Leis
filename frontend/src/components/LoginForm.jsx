import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm() {
  const { state, login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    };
  }

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = 'O username é obrigatório.';
    if (!form.password) errs.password = 'A senha é obrigatória.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(form.username.trim(), form.password);
    if (!result.success && result.errors) {
      const errs = {};
      for (const err of result.errors) {
        if (err.field) errs[err.field] = err.message;
      }
      setFieldErrors(errs);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <TextField
        label="Username"
        value={form.username}
        onChange={handleChange('username')}
        error={!!fieldErrors.username}
        helperText={fieldErrors.username}
        fullWidth
        margin="normal"
        autoFocus
      />
      <TextField
        label="Senha"
        type="password"
        value={form.password}
        onChange={handleChange('password')}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        fullWidth
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={state.loading}
      >
        {state.loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
      </Button>
    </Box>
  );
}
