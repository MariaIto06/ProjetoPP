// Importa um recurso necessário de outro arquivo ou biblioteca.
import sql from 'mssql';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import 'dotenv/config';

// Cria uma variável para guardar um valor ou referência.
const stringSQL = process.env.CONNECTION_STRING;

// Declara uma função que organiza uma tarefa do programa.
async function conectaBD() {
  // Verifica uma condição antes de executar a próxima ação.
  if (!stringSQL) throw new Error('Configure CONNECTION_STRING no arquivo .env');
  // Espera a operação assíncrona terminar antes de continuar.
  return await sql.connect(stringSQL);
// Fecha o bloco ou a instrução anterior.
}

// Disponibiliza este recurso para outros arquivos importarem.
export default conectaBD;
