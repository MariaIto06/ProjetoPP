import mssql from "mssql";
import conectaBD from "../config/dbConnect.js";

class Status {
    constructor(id, perfil) {
        this.id = id;
        this.perfil = perfil;
    }

    static async buscarTodos() {
        const conexao = await conectaBD();

        const result = await conexao.request().query(
            "SELECT * FROM reservas.status"
        );

        return result.recordset;
    }

    static async inserirStatus(status) {
        const conexao = await conectaBD();

        await conexao.request()
            .input("perfil", mssql.VarChar(100), status.perfil)
            .query(`
                INSERT INTO reservas.status (perfil)
                VALUES (@perfil)
            `);
    }
}

export default Status;
