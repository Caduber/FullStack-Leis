import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PropostaProvider } from './context/PropostaContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import InsertPanel from './components/InsertPanel.jsx';
import ErrorAlert from './components/ErrorAlert.jsx';

function AppContent() {
  const { state: authState } = useAuth();
  const [tab, setTab] = useState(0);

  if (!authState.user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ErrorAlert message={authState.error} />
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
            <Tab label="Login" />
            <Tab label="Cadastro" />
          </Tabs>
          {tab === 0 && <LoginForm />}
          {tab === 1 && <RegisterForm />}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <ErrorAlert message={authState.error} />
      <Box sx={{ flex: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Buscar Proposições" />
          <Tab label="Inserir Proposição" />
        </Tabs>
        <PropostaProvider>
          {tab === 0 && <SearchPanel />}
          {tab === 1 && <InsertPanel />}
        </PropostaProvider>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
