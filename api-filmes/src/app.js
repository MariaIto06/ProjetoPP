// Importa um recurso necessário de outro arquivo ou biblioteca.
import express from 'express';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import cors from 'cors';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import path from 'path';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import { fileURLToPath } from 'url';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import routes from './routes/index.js';

// Cria uma variável para guardar um valor ou referência.
const __filename = fileURLToPath(import.meta.url);
// Cria uma variável para guardar um valor ou referência.
const __dirname = path.dirname(__filename);
// Cria uma variável para guardar um valor ou referência.
const app = express();
// Registra uma configuração ou um conjunto de rotas na aplicação Express.
app.use(cors());
// Registra uma configuração ou um conjunto de rotas na aplicação Express.
app.use(express.json());
// Registra uma configuração ou um conjunto de rotas na aplicação Express.
app.use(express.static(path.join(__dirname, '..', 'public')));
// Define a rota GET que entrega a página inicial.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
// Registra uma configuração ou um conjunto de rotas na aplicação Express.
app.use('/api', routes);
// Disponibiliza este recurso para outros arquivos importarem.
export default app;
