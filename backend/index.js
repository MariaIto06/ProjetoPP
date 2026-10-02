import 'dotenv/config';
import express from 'express';
import mssql from 'mssql';
import cors from 'cors';

const porta = process.env.PORTA;
const stringSQL = process.env.CONNECTION_STRING;

// configurações
const app = express();
app.use(express.json());

// conectar no BD
async function conectaBD() {
    try {
        await mssql.connect(stringSQL);
        return mssql;
    }
    catch (erro) {
        console.log("Erro no acesso ao BD.", erro);
    }
}

// definir rotas
app.get('/laboratorios', async (req, res) => {
    const conexao = await conectaBD();
    const result = await conexao.query("SELECT * FROM reservas.laboratorio");
    res.json(result.recordset);
});

app.use('/', (req, res) => {
    return res.json({ message: "Servidor rodando" });
});

// colocar servidor para atender requisições
app.listen(porta, () => console.log(`API funcionando!\nServidor rodando em: http://localhost:${porta}`));