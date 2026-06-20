import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env
import app from './src/app.js';

const PORT = parseInt(process.env.PORT, 10) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`); 
});
