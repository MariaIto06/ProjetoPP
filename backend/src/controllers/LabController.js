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

    static async alterarLaboratorio(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do laboratório inválido."
                });
            }

            const quantidadeAlterada = await Laboratorio.alterarLaboratorio(
                id,
                req.body
            );

            if (quantidadeAlterada === 0) {
                return res.status(404).json({
                    message: "Laboratório não encontrado."
                });
            }

            return res.status(200).json({
                message: "Laboratório alterado com sucesso!"
            });

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao alterar laboratório."
            });
        }
    }


    static async excluirLaboratorio(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do laboratório inválido."
                });
            }

            const quantidadeExcluida = await Laboratorio.excluirLaboratorio(id);

            if (quantidadeExcluida === 0) {
                return res.status(404).json({
                    message: "Laboratório não encontrado."
                });
            }

            return res.status(200).json({
                message: "Laboratório excluído com sucesso!"
            });

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao excluir laboratório."
            });
        }
    }
}

export default LaboratorioController;