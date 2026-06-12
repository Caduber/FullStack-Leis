import 'dotenv/config';
import app from './src/app.js';

const PORT = parseInt(process.env.PORT, 10) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
