import { createPortal } from 'react-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

export default function ErrorAlert({ message }) {
  if (!message) return null;

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: 300,
      }}
    >
      <Alert severity="error">{message}</Alert>
    </Box>,
    document.body,
  );
}
