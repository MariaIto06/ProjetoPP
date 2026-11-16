import sql from 'mssql';
import 'dotenv/config';

const stringSQL = process.env.CONNECTION_STRING;

async function conectaBD() {
  if (!stringSQL) throw new Error('Configure CONNECTION_STRING no arquivo .env');
  return await sql.connect(stringSQL);
}

export default conectaBD;
