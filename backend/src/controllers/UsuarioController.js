import Usuario from "../models/Usuario.js";

class UsuarioController {
    static async listarUsuarios(req, res) {
        try {
            const lista = await Usuario.buscarTodos();
            return res.status(200).json(lista);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao listar usuários"
            });
        }
    }

    static async inserirUsuario(req, res) {
        try {
            await Usuario.inserirUsuario(req.body);

            return res.status(201).json({
                message: "Usuário cadastrado com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao cadastrar usuário"
            });
        }
    }

    static async inserirUsuarioProfessor(req, res) {
        try {
            await Usuario.inserirUsuario(req.body, "aluno");

            return res.status(201).json({
                message: "Aluno cadastrado com sucesso!"
            });
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao cadastrar aluno."
            });
        }
    }

    static async alterarPerfil(req, res) {
        try {
            const id = Number(req.params.id);
            const { tipoUsuario } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do usuário inválido."
                });
            }

            if (!["aluno", "professor"].includes(tipoUsuario)) {
                return res.status(400).json({
                    message: "Selecione aluno ou professor."
                });
            }

            const atualizado = await Usuario.alterarPerfil(
                id,
                tipoUsuario
            );

            if (!atualizado) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }

            return res.status(200).json({
                message: "Perfil atualizado com sucesso!"
            });
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                message: "Falha ao alterar o perfil do usuário."
            });
        }
    }
}

export default UsuarioController;
