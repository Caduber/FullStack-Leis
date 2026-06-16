import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useAuth } from '../context/AuthContext.jsx';
import { useProposta } from '../context/PropostaContext.jsx';
import PropostaCard from './Card.jsx';

export default function SearchPanel() {
  const { state: authState } = useAuth();
  const { state, search } = useProposta();
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  function validate() {
    if (!keyword.trim()) {
      setError('O campo de busca é obrigatório.');
      inputRef.current?.focus();
      return false;
    }
    if (keyword.trim().length < 3) {
      setError('Digite ao menos 3 caracteres.');
      inputRef.current?.focus();
      return false;
    }
    setError('');
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    search(keyword.trim(), authState.token);
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'flex-start' }}
      >
        <TextField
          inputRef={inputRef}
          label="Palavra-chave"
          placeholder="Ex: PL, PEC, ambiente..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setError(''); }}
          error={!!error}
          helperText={error}
          sx={{ width: '40%' }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          {state.loading ? <CircularProgress size={24} color="inherit" /> : 'Pesquisar'}
        </Button>
      </Box>

      {state.error && (
        <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
          {state.error}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          p: 3,
          justifyContent: 'center',
        }}
      >
        {state.resultados.length === 0 && !state.loading && !state.error && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            Faça uma busca para encontrar proposições.
          </Typography>
        )}
        {state.resultados.map((item) => (
          <PropostaCard key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
}
