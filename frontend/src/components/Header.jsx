import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { state, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Buscador da Câmara
        </Typography>
        {state.user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{state.user.username}</Typography>
            <Button color="inherit" onClick={logout}>
              Sair
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
