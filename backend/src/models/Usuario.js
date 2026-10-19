import mssql from "mssql";
import conectaBD from "../config/dbConnect.js";
import bcrypt from "bcrypt";

class Usuario {
    constructor(id, cpf, nome, datanascimento, celular, email, login, senha, datacadastro) {
        this.id = id;
        this.cpf = cpf;
        this.nome = nome;
        this.datanascimento = datanascimento;
        this.celular = celular;
        this.email = email;
        this.login = login;
        this.senha = senha;
        this.datacadastro = datacadastro;
    }

    static async buscarTodos() {
        const conexao = await conectaBD();

        const result = await conexao.request().query(
            "SELECT id, cpf, nome, datanascimento, celular, email, login, datacadastro FROM reservas.usuario"
        );

        return result.recordset;
    }
    static async buscarPorLogin(login) {
        const conexao = await conectaBD();

        const result = await conexao.request()
            .input("login", mssql.VarChar(50), login)
            .query(`
                SELECT
                    id,
                    cpf,
                    nome,
                    datanascimento,
                    celular,
                    email,
                    login,
                    senha,
                    datacadastro,
                    tipoUsuario
                FROM reservas.usuario
                WHERE login = @login
            `);

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    }


    static async inserirUsuario(usuario) {
        const {
            cpf, nome, datanascimento, celular, email, login, senha
        } = usuario;
        const senhaHash = await bcrypt.hash(senha, 10);
        const conexao = await conectaBD();

        await conexao.request()
            .input("cpf", mssql.VarChar(14), cpf)
            .input("nome", mssql.VarChar(100), nome)
            .input("datanascimento", mssql.Date, datanascimento)
            .input("celular", mssql.VarChar(20), celular)
            .input("email", mssql.VarChar(100), email)
            .input("login", mssql.VarChar(50), login)
            .input("senha", mssql.VarChar(100), senhaHash)
            .query(`
                INSERT INTO reservas.usuario
                    (cpf, nome, datanascimento, celular, email, login, senha)
                VALUES
                    (@cpf, @nome, @datanascimento, @celular, @email, @login, @senha)
            `);
    }
}

export default Usuario;
