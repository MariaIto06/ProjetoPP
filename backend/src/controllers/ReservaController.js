
import Reserva from "../models/Reserva.js";

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
            const {
                idSala,
                idLaboratorio,
                inicio,
                fim
            } = req.body;

            const idUsuario = req.usuario?.id;

            if (!idUsuario) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }

            if ((idSala == null) === (idLaboratorio == null)) {
                return res.status(400).json({
                    message: "Informe uma sala ou um laboratório"
                });
            }

            const dataInicio = new Date(inicio);
            const dataFim = new Date(fim);

            if (
                !inicio ||
                !fim ||
                isNaN(dataInicio.getTime()) ||
                isNaN(dataFim.getTime())
            ) {
                return res.status(400).json({
                    message: "Informe datas e horários válidos"
                });
            }

            const duracao = (dataFim - dataInicio) / 60000;

            if (duracao <= 0) {
                return res.status(400).json({
                    message: "O horário final deve ser posterior ao inicial"
                });
            }

            if (duracao > 165) {
                return res.status(400).json({
                    message: "A reserva não pode ultrapassar 165 minutos"
                });
            }

            await Reserva.inserirReserva({
                idSala,
                idLaboratorio,
                idUsuario,
                inicio: dataInicio,
                fim: dataFim
            });

            return res.status(201).json({
                message: "Reserva cadastrada com sucesso!"
            });
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao cadastrar reserva"
            });
        }
    }
}

export default ReservaController;

