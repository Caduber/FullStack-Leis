import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#190202',
        py: 3,
        px: 2,
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Typography variant="body2" sx={{ color: '#f3f3f3' }}>
        Carlos Lopes e Bruno Dutra &copy; 2026 Buscador da Câmara.
      </Typography>
    </Box>
  );
}
