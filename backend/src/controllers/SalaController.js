import Sala from "../models/Sala.js";

class SalaController {
    static async listarSalas(req, res) {
        try {
            const lista = await Sala.buscarTodos();
            return res.status(200).json(lista);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao listar salas"
            });
        }
    }

    static async inserirSala(req, res) {
        try {
            await Sala.inserirSala(req.body);

            return res.status(201).json({
                message: "Sala cadastrada com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao cadastrar sala"
            });
        }
    }
}

export default SalaController;
