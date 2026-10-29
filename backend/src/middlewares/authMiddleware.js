
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const autenticar = async (req, res, next) => {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    const token = cabecalho.split(" ")[1];

    let dados;

    try {
        dados = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado"
        });
    }

    const idUsuario = Number(dados.id);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(401).json({
            message: "Token inválido"
        });
    }

    try {
        // Consultar o perfil atualizado no banco
        const usuario = await Usuario.buscarPorId(idUsuario);

        if (!usuario) {
            return res.status(401).json({
                message: "Usuário não encontrado"
            });
        }

        // Usar as permissões atuais, não as antigas do token
        req.usuario = {
            id: usuario.id,
            tipoUsuario: usuario.tipoUsuario
        };

        next();
    } catch (erro) {
        console.error("Erro ao verificar usuário:", erro);

        return res.status(500).json({
            message: "Falha ao verificar as permissões do usuário"
        });
    }
};

const somenteProfessor = (req, res, next) => {
    const tipoUsuario = req.usuario?.tipoUsuario;

    if (
        tipoUsuario !== "professor" &&
        tipoUsuario !== "administrador"
    ) {
        return res.status(403).json({
            message: "Acesso permitido apenas para professores e administradores."
        });
    }

    next();
};

const somenteAdministrador = (req, res, next) => {
    if (req.usuario?.tipoUsuario !== "administrador") {
        return res.status(403).json({
            message: "Acesso permitido apenas para administradores."
        });
    }

    next();
};

export { autenticar, somenteProfessor, somenteAdministrador };
