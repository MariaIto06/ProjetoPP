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

        const result = await conexao.request().query(`
            SELECT
                id, cpf, nome, datanascimento, celular,
                email, login, datacadastro, tipoUsuario
            FROM reservas.usuario
        `);

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


    static async inserirUsuario(usuario, tipoUsuario = "aluno") {
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
            .input("tipoUsuario", mssql.VarChar(20), tipoUsuario)
            .query(`
                INSERT INTO reservas.usuario
                    (cpf, nome, datanascimento, celular, email, login, senha, tipoUsuario)
                VALUES
                    (@cpf, @nome, @datanascimento, @celular, @email, @login, @senha, @tipoUsuario)
            `);
    }

    static async alterarPerfil(id, tipoUsuario) {
        const conexao = await conectaBD();

        const resultado = await conexao.request()
            .input("id", mssql.Int, id)
            .input("tipoUsuario", mssql.VarChar(20), tipoUsuario)
            .query(`
                UPDATE reservas.usuario
                SET tipoUsuario = @tipoUsuario
                WHERE id = @id
            `);

        return resultado.rowsAffected[0] > 0;
    }

    
    static async buscarPorId(id) {
        const conexao = await conectaBD();

        const resultado = await conexao.request()
            .input("id", mssql.Int, id)
            .query(`
                SELECT id, tipoUsuario
                FROM reservas.usuario
                WHERE id = @id
            `);

        return resultado.recordset[0] ?? null;
    }

}

export default Usuario;
