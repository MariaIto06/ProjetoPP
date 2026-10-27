import mssql from "mssql";
import conectaBD from "../config/dbConnect.js";

class Laboratorio {
    constructor(id, codigo, nome, capacidade, localizacao) {
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.capacidade = capacidade;
        this.localizacao = localizacao;
    }

    static async buscarTodos() {
        const conexao = await conectaBD();

        const result = await conexao.request().query(
            "SELECT * FROM reservas.laboratorio"
        );

        return result.recordset.map(
            row => new Laboratorio(
                row.id,
                row.codigo,
                row.nome,
                row.capacidade,
                row.localizacao
            )
        );
    }

    static async inserirLaboratorio(laboratorio) {
        const { codigo, nome, capacidade, localizacao } = laboratorio;
        const conexao = await conectaBD();

        await conexao.request()
            .input("codigo", mssql.VarChar(20), codigo)
            .input("nome", mssql.VarChar(100), nome)
            .input("capacidade", mssql.Int, capacidade)
            .input("localizacao", mssql.VarChar(100), localizacao)
            .query(`
                INSERT INTO reservas.laboratorio
                    (codigo, nome, capacidade, localizacao)
                VALUES
                    (@codigo, @nome, @capacidade, @localizacao)
            `);
    }

    static async alterarLaboratorio(id, laboratorio) {
        const { codigo, nome, capacidade, localizacao } = laboratorio;

        const conexao = await conectaBD();

        const resultado = await conexao.request()
            .input("id", mssql.Int, id)
            .input("codigo", mssql.VarChar(20), codigo)
            .input("nome", mssql.VarChar(100), nome)
            .input("capacidade", mssql.Int, capacidade)
            .input("localizacao", mssql.VarChar(100), localizacao)
            .query(`
                UPDATE reservas.laboratorio
                SET
                    codigo = @codigo,
                    nome = @nome,
                    capacidade = @capacidade,
                    localizacao = @localizacao
                WHERE id = @id
            `);

        return resultado.rowsAffected[0];
    }


    static async excluirLaboratorio(id) {
        const conexao = await conectaBD();

        const resultado = await conexao.request()
            .input("id", mssql.Int, id)
            .query(`
                DELETE FROM reservas.laboratorio
                WHERE id = @id
            `);

        return resultado.rowsAffected[0];
    }

}

export default Laboratorio;
