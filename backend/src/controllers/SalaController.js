
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

    static async alterarSala(req, res) {
        try {
            const id = Number(req.params.id);
            const { codigo, nome, capacidade, localizacao } = req.body;

            if (
                !Number.isInteger(id) ||
                id <= 0 ||
                !codigo ||
                !nome ||
                !localizacao ||
                !Number.isInteger(Number(capacidade)) ||
                Number(capacidade) <= 0
            ) {
                return res.status(400).json({
                    message: "Preencha os dados corretamente."
                });
            }

            const atualizado = await Sala.alterarSala(id, {
                codigo,
                nome,
                capacidade: Number(capacidade),
                localizacao
            });

            if (!atualizado) {
                return res.status(404).json({
                    message: "Sala não encontrada."
                });
            }

            return res.status(200).json({
                message: "Sala atualizada com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao editar sala."
            });
        }
    }

    static async excluirSala(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID da sala inválido."
                });
            }

            const excluido = await Sala.excluirSala(id);

            if (!excluido) {
                return res.status(404).json({
                    message: "Sala não encontrada."
                });
            }

            return res.status(200).json({
                message: "Sala excluída com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Não foi possível excluir a sala. Verifique se ela possui reservas."
            });
        }
    }
}

export default SalaController;
