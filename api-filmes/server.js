// Importa um recurso necessário de outro arquivo ou biblioteca.
import 'dotenv/config';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import app from './src/app.js';

// Cria uma variável para guardar um valor ou referência.
const PORTA = process.env.PORTA || 8080;
// Inicia o servidor HTTP na porta configurada.
app.listen(PORTA, () => console.log(`Servidor rodando em http://localhost:${PORTA}`));
