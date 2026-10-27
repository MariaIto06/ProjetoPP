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
            const { tipoUsuario } = req.body;

            if (!["aluno", "professor"].includes(tipoUsuario)) {
                return res.status(400).json({
                    message: "Tipo de usuário inválido"
                });
            }

            await Usuario.inserirUsuario(req.body, tipoUsuario);

            return res.status(201).json({
                message: "Usuário cadastrado pelo professor com sucesso!"
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({
                message: "Falha ao cadastrar usuário"
            });
        }
    }
}

export default UsuarioController;
