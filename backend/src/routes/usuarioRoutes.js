import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import {
    autenticar,
    somenteProfessor,
    somenteAdministrador
} from "../middlewares/authMiddleware.js";

const routes = express.Router();

// Professores e administradores podem consultar usuários
routes.get(
    "/usuarios",
    autenticar,
    somenteProfessor,
    UsuarioController.listarUsuarios
);

// Cadastro público: cria sempre uma conta de aluno
routes.post(
    "/usuario",
    UsuarioController.inserirUsuario
);

// Professores e administradores podem cadastrar alunos
routes.post(
    "/usuarios/administrativo",
    autenticar,
    somenteProfessor,
    UsuarioController.inserirUsuarioProfessor
);

// Somente administradores podem alterar perfis
routes.patch(
    "/usuarios/:id/perfil",
    autenticar,
    somenteAdministrador,
    UsuarioController.alterarPerfil
);

export default routes;