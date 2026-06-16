import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterForm() {
  const { state, register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    else if (form.username.trim().length < 3) errs.username = 'O username deve ter no mínimo 3 caracteres.';
    if (!form.email.trim()) errs.email = 'O email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Formato de email inválido.';
    if (!form.password) errs.password = 'A senha é obrigatória.';
    else if (form.password.length < 6) errs.password = 'A senha deve ter no mínimo 6 caracteres.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'As senhas não conferem.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const result = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });
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
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        fullWidth
        margin="normal"
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
      <TextField
        label="Confirmar senha"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={!!fieldErrors.confirmPassword}
        helperText={fieldErrors.confirmPassword}
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
        {state.loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
      </Button>
    </Box>
  );
}
