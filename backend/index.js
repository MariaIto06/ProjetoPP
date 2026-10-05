import 'dotenv/config';
import express from 'express';
import mssql from 'mssql';
import cors from 'cors';

const porta = process.env.PORTA;
const stringSQL = process.env.CONNECTION_STRING;

// configurações
const app = express();
app.use(cors());
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

// definir rotas da api
app.get('/laboratorios', async (req, res) => {
    const conexao = await conectaBD();
    const result = await conexao.query("SELECT * FROM reservas.laboratorio");
    res.json(result.recordset);
});

app.post('/laboratorio', async(req, res)=>{
    const {codigo, nome, capacidade, localizacao } = req.body;
    const conexao = await conectaBD();
    const result = await conexao.query(`
        INSERT INTO reservas.laboratorio
        (codigo, nome, capacidade, localizacao)
        VALUES
        ('${codigo}', '${nome}', ${capacidade}, '${localizacao}')
    `);

    res.json({ message: "Laboratório cadastrado com sucesso!" });

});
app.get('/status', async (req, res) => {
    const conexao = await conectaBD();
    const result = await conexao.query("SELECT * FROM reservas.status");
    res.json(result.recordset);
});

app.post('/status', async(req, res)=>{
    const {perfil} = req.body;
    const conexao = await conectaBD();
    const result = await conexao.query(`
        INSERT INTO reservas.status
        (perfil)
        VALUES
        ('${perfil}')
    `);

    res.json({ message: "status cadastrado com sucesso!" });

});

app.get('/usuarios', async (req, res) => {
    const conexao = await conectaBD();
    const result = await conexao.query("SELECT * FROM reservas.usuario");
    res.json(result.recordset);
});

app.post('/usuario', async(req, res)=>{
    const {cpf, nome, datanascimento, celular, email, login, senha, dataCadastro } = req.body;
    const conexao = await conectaBD();
    const result = await conexao.query(`
        INSERT INTO reservas.usuario
        (cpf, nome, datanascimento, celular, email, login, senha, dataCadastro)
        VALUES
        ('${cpf}', '${nome}', ${datanascimento}, '${celular}',${email},${login},${senha}, ${dataCadastro})
    `);

    res.json({ message: "Laboratório cadastrado com sucesso!" });

});
app.get('/salas', async (req, res) => {
    const conexao = await conectaBD();
    const result = await conexao.query("SELECT * FROM reservas.sala");
    res.json(result.recordset);
});

app.post('/sala', async(req, res)=>{
    const {codigo, nome, capacidade, localizacao } = req.body;
    const conexao = await conectaBD();
    const result = await conexao.query(`
        INSERT INTO reservas.sala
        (codigo, nome, capacidade, localizacao)
        VALUES
        ('${codigo}', '${nome}', ${capacidade}, '${localizacao}')
    `);

    res.json({ message: "Laboratório cadastrado com sucesso!" });

});


app.use('/', (req, res) => {
    return res.json({ message: "Servidor rodando" });
});

// colocar servidor para atender requisições
app.listen(porta, () => console.log(`API funcionando!\nServidor rodando em: http://localhost:${porta}`));