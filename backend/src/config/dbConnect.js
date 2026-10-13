import mssql from 'mssql';
import 'dotenv/config';

const stringSQL = process.env.CONNECTION_STRING;

// conectar no BD
async function conectaBD() {
    try {
        const conexao = await mssql.connect(stringSQL);
        return conexao;
    }
    catch (erro) {
        console.log("Erro no acesso ao BD.", erro);
        throw erro;
    }
}

export default conectaBD;
