import mssql from "mssql";
import conectaBD from "../config/dbConnect.js";

class Reserva {
    static async buscarTodos() {
        const conexao = await conectaBD();

        const result = await conexao.request().query(`
            SELECT
                r.id,
                r.idSala,
                r.idLaboratorio,
                r.idUsuario,
                r.inicio,
                r.fim,
                r.statusReserva,
                u.nome AS nomeUsuario,
                s.codigo AS codigoSala,
                s.nome AS nomeSala,
                l.codigo AS codigoLaboratorio,
                l.nome AS nomeLaboratorio
            FROM reservas.reserva r
            INNER JOIN reservas.usuario u
                ON r.idUsuario = u.id
            LEFT JOIN reservas.sala s
                ON r.idSala = s.id
            LEFT JOIN reservas.laboratorio l
                ON r.idLaboratorio = l.id
            ORDER BY r.inicio
        `);

        return result.recordset;
    }

    static async inserirReserva(reserva) {
        const {
            idSala,
            idLaboratorio,
            idUsuario,
            inicio,
            fim
        } = reserva;

        const conexao = await conectaBD();

        await conexao.request()
            .input("idSala", mssql.Int, idSala ?? null)
            .input("idLaboratorio", mssql.Int, idLaboratorio ?? null)
            .input("idUsuario", mssql.Int, idUsuario)
            .input("inicio", mssql.DateTime2, inicio)
            .input("fim", mssql.DateTime2, fim)
            .query(`
                INSERT INTO reservas.reserva
                    (idSala, idLaboratorio, idUsuario, inicio, fim)
                VALUES
                    (@idSala, @idLaboratorio, @idUsuario, @inicio, @fim)
            `);
    }
}

export default Reserva;