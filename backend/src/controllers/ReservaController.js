
import Reserva from "../models/Reserva.js";

// Validar os dados utilizados no cadastro e na edição
function validarDadosReserva({
    idSala,
    idLaboratorio,
    inicio,
    fim
}) {
    if ((idSala == null) === (idLaboratorio == null)) {
        return {
            erro: "Informe uma sala ou um laboratório"
        };
    }

    const idRecurso = idSala ?? idLaboratorio;

    if (
        !Number.isInteger(Number(idRecurso)) ||
        Number(idRecurso) <= 0
    ) {
        return {
            erro: "Selecione um recurso válido."
        };
    }

    if (!inicio || !fim) {
        return {
            erro: "Informe datas e horários válidos"
        };
    }

    const formatoDataHora =
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

    if (
        typeof inicio !== "string" ||
        typeof fim !== "string"
    ) {
        return {
            erro: "Informe datas e horários válidos"
        };
    }

    const partesInicio = inicio.match(formatoDataHora);
    const partesFim = fim.match(formatoDataHora);

    if (!partesInicio || !partesFim) {
        return {
            erro: "Informe datas e horários válidos"
        };
    }

    const [
        ,
        anoInicio,
        mesInicio,
        diaInicio,
        horaInicio,
        minutoInicio
    ] = partesInicio.map(Number);

    const [
        ,
        anoFim,
        mesFim,
        diaFim,
        horaFim,
        minutoFim
    ] = partesFim.map(Number);

    const dataInicio = new Date(
        anoInicio,
        mesInicio - 1,
        diaInicio,
        horaInicio,
        minutoInicio
    );

    const dataFim = new Date(
        anoFim,
        mesFim - 1,
        diaFim,
        horaFim,
        minutoFim
    );

    // Impedir datas inexistentes, como 31/02
    if (
        dataInicio.getFullYear() !== anoInicio ||
        dataInicio.getMonth() !== mesInicio - 1 ||
        dataInicio.getDate() !== diaInicio ||
        dataInicio.getHours() !== horaInicio ||
        dataInicio.getMinutes() !== minutoInicio ||
        dataFim.getFullYear() !== anoFim ||
        dataFim.getMonth() !== mesFim - 1 ||
        dataFim.getDate() !== diaFim ||
        dataFim.getHours() !== horaFim ||
        dataFim.getMinutes() !== minutoFim
    ) {
        return {
            erro: "Informe datas e horários válidos"
        };
    }

    // A reserva deve começar e terminar no mesmo dia
    if (
        anoInicio !== anoFim ||
        mesInicio !== mesFim ||
        diaInicio !== diaFim
    ) {
        return {
            erro: "A reserva deve começar e terminar no mesmo dia."
        };
    }

    // Não permitir domingos
    if (
        dataInicio.getDay() === 0 ||
        dataFim.getDay() === 0
    ) {
        return {
            erro: "Não são permitidas reservas aos domingos."
        };
    }

    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFim = horaFim * 60 + minutoFim;

    if (
        minutosInicio < 7 * 60 ||
        minutosFim > 23 * 60
    ) {
        return {
            erro: "As reservas devem ocorrer entre 07:00 e 23:00."
        };
    }

    const duracao =
        (dataFim.getTime() - dataInicio.getTime()) / 60000;

    if (duracao <= 0) {
        return {
            erro: "O horário final deve ser posterior ao inicial."
        };
    }

    if (duracao > 165) {
        return {
            erro: "A reserva não pode ultrapassar 165 minutos."
        };
    }

    return {
        dados: {
            idSala: idSala == null ? null : Number(idSala),
            idLaboratorio:
                idLaboratorio == null ? null : Number(idLaboratorio),
            inicio: dataInicio,
            fim: dataFim
        }
    };
}

class ReservaController {
    static async listarReservas(req, res) {
        try {
            const lista = await Reserva.buscarTodos();

            return res.status(200).json(lista);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao listar reservas"
            });
        }
    }

    static async inserirReserva(req, res) {
        try {
            const idUsuario = req.usuario?.id;

            if (!idUsuario) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }

            const validacao = validarDadosReserva(req.body);

            if (validacao.erro) {
                return res.status(400).json({
                    message: validacao.erro
                });
            }

            await Reserva.inserirReserva({
                ...validacao.dados,
                idUsuario
            });

            return res.status(201).json({
                message: "Reserva cadastrada com sucesso!"
            });
        } catch (erro) {
            if (erro.code === "RESERVA_CONFLITO") {
                return res.status(409).json({
                    message: erro.message
                });
            }

            console.error(erro);

            return res.status(500).json({
                message: "Falha ao cadastrar reserva"
            });
        }
    }

    static async atualizarReserva(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID da reserva inválido."
                });
            }

            const validacao = validarDadosReserva(req.body);

            if (validacao.erro) {
                return res.status(400).json({
                    message: validacao.erro
                });
            }

            await Reserva.atualizarReserva(
                id,
                validacao.dados
            );

            return res.status(200).json({
                message: "Reserva atualizada com sucesso!"
            });
        } catch (erro) {
            if (erro.code === "RESERVA_CONFLITO") {
                return res.status(409).json({
                    message: erro.message
                });
            }

            if (erro.code === "RESERVA_NAO_ENCONTRADA") {
                return res.status(404).json({
                    message: erro.message
                });
            }

            console.error(erro);

            return res.status(500).json({
                message: "Falha ao atualizar reserva"
            });
        }
    }

    static async excluirReserva(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID da reserva inválido."
                });
            }

            await Reserva.excluirReserva(id);

            return res.status(200).json({
                message: "Reserva excluída com sucesso!"
            });
        } catch (erro) {
            if (erro.code === "RESERVA_NAO_ENCONTRADA") {
                return res.status(404).json({
                    message: erro.message
                });
            }

            console.error(erro);

            return res.status(500).json({
                message: "Falha ao excluir reserva"
            });
        }
    }
}

export default ReservaController;