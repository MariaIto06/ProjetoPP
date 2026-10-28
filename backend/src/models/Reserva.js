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
        const transacao = new mssql.Transaction(conexao);

        let transacaoIniciada = false;

        try {
            await transacao.begin(
                mssql.ISOLATION_LEVEL.SERIALIZABLE
            );

            transacaoIniciada = true;

            const resultado = await transacao.request()
                .input("idSala", mssql.Int, idSala ?? null)
                .input(
                    "idLaboratorio",
                    mssql.Int,
                    idLaboratorio ?? null
                )
                .input("inicio", mssql.DateTime2, inicio)
                .input("fim", mssql.DateTime2, fim)
                .query(`
                    SELECT TOP 1 r.id
                    FROM reservas.reserva r WITH (UPDLOCK, HOLDLOCK)
                    WHERE
                        (
                            (
                                @idSala IS NOT NULL
                                AND r.idSala = @idSala
                            )
                            OR
                            (
                                @idLaboratorio IS NOT NULL
                                AND r.idLaboratorio = @idLaboratorio
                            )
                        )
                        AND r.inicio < DATEADD(MINUTE, 15, @fim)
                        AND r.fim > DATEADD(MINUTE, -15, @inicio)
                `);

            if (resultado.recordset.length > 0) {
                const erro = new Error(
                    "Esse recurso já possui uma reserva nesse horário ou não há 15 minutos de intervalo."
                );

                erro.code = "RESERVA_CONFLITO";

                throw erro;
            }

            await transacao.request()
                .input("idSala", mssql.Int, idSala ?? null)
                .input(
                    "idLaboratorio",
                    mssql.Int,
                    idLaboratorio ?? null
                )
                .input("idUsuario", mssql.Int, idUsuario)
                .input("inicio", mssql.DateTime2, inicio)
                .input("fim", mssql.DateTime2, fim)
                .query(`
                    INSERT INTO reservas.reserva (
                        idSala,
                        idLaboratorio,
                        idUsuario,
                        inicio,
                        fim
                    )
                    VALUES (
                        @idSala,
                        @idLaboratorio,
                        @idUsuario,
                        @inicio,
                        @fim
                    )
                `);

            await transacao.commit();
        } catch (erro) {
            if (transacaoIniciada) {
                try {
                    await transacao.rollback();
                } catch (erroRollback) {
                    console.error(
                        "Erro ao desfazer transação:",
                        erroRollback
                    );
                }
            }

            throw erro;
        }
    }

    static async atualizarReserva(id, idUsuario, reserva) {
        const {
            idSala,
            idLaboratorio,
            inicio,
            fim
        } = reserva;

        const conexao = await conectaBD();
        const transacao = new mssql.Transaction(conexao);

        let transacaoIniciada = false;

        try {
            await transacao.begin(
                mssql.ISOLATION_LEVEL.SERIALIZABLE
            );

            transacaoIniciada = true;

            // Verificar quem criou a reserva
            const proprietario = await transacao.request()
                .input("id", mssql.Int, id)
                .query(`
                    SELECT idUsuario
                    FROM reservas.reserva WITH (UPDLOCK, HOLDLOCK)
                    WHERE id = @id
                `);

            if (proprietario.recordset.length === 0) {
                const erro = new Error("Reserva não encontrada.");
                erro.code = "RESERVA_NAO_ENCONTRADA";
                throw erro;
            }

            if (Number(proprietario.recordset[0].idUsuario) !== idUsuario) {
                const erro = new Error(
                    "Você só pode editar reservas feitas por você."
                );
                erro.code = "RESERVA_SEM_PERMISSAO";
                throw erro;
            }

            const resultado = await transacao.request()
                .input("id", mssql.Int, id)
                .input("idSala", mssql.Int, idSala ?? null)
                .input(
                    "idLaboratorio",
                    mssql.Int,
                    idLaboratorio ?? null
                )
                .input("inicio", mssql.DateTime2, inicio)
                .input("fim", mssql.DateTime2, fim)
                .query(`
                    SELECT TOP 1 r.id
                    FROM reservas.reserva r WITH (UPDLOCK, HOLDLOCK)
                    WHERE
                        r.id <> @id
                        AND (
                            (
                                @idSala IS NOT NULL
                                AND r.idSala = @idSala
                            )
                            OR
                            (
                                @idLaboratorio IS NOT NULL
                                AND r.idLaboratorio = @idLaboratorio
                            )
                        )
                        AND r.inicio < DATEADD(MINUTE, 15, @fim)
                        AND r.fim > DATEADD(MINUTE, -15, @inicio)
                `);

            if (resultado.recordset.length > 0) {
                const erro = new Error(
                    "Esse recurso já possui uma reserva nesse horário ou não há 15 minutos de intervalo."
                );

                erro.code = "RESERVA_CONFLITO";

                throw erro;
            }

            const atualizacao = await transacao.request()
                .input("id", mssql.Int, id)
                .input("idUsuario", mssql.Int, idUsuario)
                .input("idSala", mssql.Int, idSala ?? null)
                .input(
                    "idLaboratorio",
                    mssql.Int,
                    idLaboratorio ?? null
                )
                .input("inicio", mssql.DateTime2, inicio)
                .input("fim", mssql.DateTime2, fim)
                .query(`
                    UPDATE reservas.reserva
                    SET
                        idSala = @idSala,
                        idLaboratorio = @idLaboratorio,
                        inicio = @inicio,
                        fim = @fim
                    WHERE id = @id AND idUsuario = @idUsuario
                `);

            if (atualizacao.rowsAffected[0] === 0) {
                const erro = new Error("Reserva não encontrada.");
                erro.code = "RESERVA_NAO_ENCONTRADA";
                throw erro;
            }

            await transacao.commit();
        } catch (erro) {
            if (transacaoIniciada) {
                try {
                    await transacao.rollback();
                } catch (erroRollback) {
                    console.error(
                        "Erro ao desfazer transação:",
                        erroRollback
                    );
                }
            }

            throw erro;
        }
    }

    static async excluirReserva(id, idUsuario) {
        const conexao = await conectaBD();

        const resultado = await conexao.request()
            .input("id", mssql.Int, id)
            .input("idUsuario", mssql.Int, idUsuario)
            .query(`
                DELETE FROM reservas.reserva
                OUTPUT DELETED.id
                WHERE id = @id
                AND idUsuario = @idUsuario
            `);

        if (resultado.recordset.length > 0) {
            return;
        }

        // Descobrir se a reserva não existe ou pertence a outra pessoa
        const verificacao = await conexao.request()
            .input("id", mssql.Int, id)
            .query(`
                SELECT id
                FROM reservas.reserva
                WHERE id = @id
            `);

        if (verificacao.recordset.length === 0) {
            const erro = new Error("Reserva não encontrada.");
            erro.code = "RESERVA_NAO_ENCONTRADA";
            throw erro;
        }

        const erro = new Error(
            "Você só pode excluir reservas feitas por você."
        );
        erro.code = "RESERVA_SEM_PERMISSAO";
        throw erro;
    }
}

export default Reserva;

