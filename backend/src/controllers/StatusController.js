import Status from "../models/Status.js";

class StatusController {
    static async listarStatus(req, res) {
        try {
            const lista = await Status.buscarTodos();
            return res.status(200).json(lista);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao listar status"
            });
        }
    }

    static async inserirStatus(req, res) {
        try {
            await Status.inserirStatus(req.body);

            return res.status(201).json({
                message: "Status cadastrado com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao cadastrar status"
            });
        }
    }
}

export default StatusController;
