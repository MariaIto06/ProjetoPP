import 'dotenv/config';
import app from './src/app.js';

const PORTA = process.env.PORTA || 8080;
app.listen(PORTA, () => console.log(`Servidor rodando em http://localhost:${PORTA}`));
