import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuth } from '../context/AuthContext.jsx';

const INITIAL_FORM = {
  siglaTipo: '',
  numero: '',
  ano: '',
  ementa: '',
  dataApresentacao: '',
  uri: '',
};

export default function InsertPanel() {
  const { state: authState } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
      setSubmitError('');
      setSuccess('');
    };
  }

  function validate() {
    const errs = {};
    if (!form.siglaTipo.trim()) errs.siglaTipo = 'A sigla do tipo é obrigatória.';
    if (!form.numero) errs.numero = 'O número é obrigatório.';
    else if (!/^\d+$/.test(form.numero) || parseInt(form.numero, 10) < 1)
      errs.numero = 'O número deve ser um valor inteiro positivo.';
    if (!form.ano) errs.ano = 'O ano é obrigatório.';
    else if (!/^\d{4}$/.test(form.ano) || parseInt(form.ano, 10) < 1900 || parseInt(form.ano, 10) > 2030)
      errs.ano = 'O ano deve ser um valor entre 1900 e 2030.';
    if (!form.ementa.trim()) errs.ementa = 'A ementa é obrigatória.';
    if (!form.dataApresentacao) errs.dataApresentacao = 'A data de apresentação é obrigatória.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');
    setSuccess('');

    try {
      const body = {
        siglaTipo: form.siglaTipo.trim(),
        numero: parseInt(form.numero, 10),
        ano: parseInt(form.ano, 10),
        ementa: form.ementa.trim(),
        dataApresentacao: form.dataApresentacao,
      };
      if (form.uri.trim()) body.uri = form.uri.trim();

      const res = await fetch('/api/propostas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const errs = {};
          for (const err of data.errors) {
            if (err.field) errs[err.field] = err.message;
          }
          setFieldErrors(errs);
        } else {
          setSubmitError(data.error?.message || 'Erro ao inserir proposta.');
        }
        return;
      }

      setSuccess(`Proposta ${data.proposta.sigla_tipo} ${data.proposta.numero}/${data.proposta.ano} inserida com sucesso!`);
      setForm(INITIAL_FORM);
    } catch {
      setSubmitError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}

      <TextField
        label="Sigla do tipo"
        placeholder="Ex: PL, PEC, MPV"
        value={form.siglaTipo}
        onChange={handleChange('siglaTipo')}
        error={!!fieldErrors.siglaTipo}
        helperText={fieldErrors.siglaTipo}
        fullWidth
        margin="normal"
        autoFocus
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Número"
          value={form.numero}
          onChange={handleChange('numero')}
          error={!!fieldErrors.numero}
          helperText={fieldErrors.numero}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ano"
          placeholder="2024"
          value={form.ano}
          onChange={handleChange('ano')}
          error={!!fieldErrors.ano}
          helperText={fieldErrors.ano}
          fullWidth
          margin="normal"
        />
      </Box>
      <TextField
        label="Ementa"
        multiline
        rows={3}
        value={form.ementa}
        onChange={handleChange('ementa')}
        error={!!fieldErrors.ementa}
        helperText={fieldErrors.ementa}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Data de apresentação"
        type="date"
        value={form.dataApresentacao}
        onChange={handleChange('dataApresentacao')}
        error={!!fieldErrors.dataApresentacao}
        helperText={fieldErrors.dataApresentacao}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="URI (opcional)"
        placeholder="https://..."
        value={form.uri}
        onChange={handleChange('uri')}
        fullWidth
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Inserindo...' : 'Inserir'}
      </Button>
    </Box>
  );
}
