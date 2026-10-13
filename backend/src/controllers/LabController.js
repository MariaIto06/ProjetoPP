import Laboratorio from "../models/Laboratorio.js";

class LaboratorioController {
    static async listarLaboratorios(req, res) {
        try {
            const lista = await Laboratorio.buscarTodos();
            return res.status(200).json(lista);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao listar laboratórios"
            });
        }
    }

    static async inserirLaboratorio(req, res) {
        try {
            await Laboratorio.inserirLaboratorio(req.body);

            return res.status(201).json({
                message: "Laboratório cadastrado com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao cadastrar laboratório"
            });
        }
    }
}

export default LaboratorioController;