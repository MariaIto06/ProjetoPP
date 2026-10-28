import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import {
    autenticar,
    somenteAdministrador
} from "../middlewares/authMiddleware.js";

const routes = express.Router();

// Somente administradores podem consultar usuários
routes.get(
    "/usuarios",
    autenticar,
    somenteAdministrador,
    UsuarioController.listarUsuarios
);

// Cadastro público: sempre cria uma conta de aluno
routes.post(
    "/usuario",
    UsuarioController.inserirUsuario
);

// Somente administradores podem cadastrar usuários
// com perfis de aluno ou professor
routes.post(
    "/usuarios/administrativo",
    autenticar,
    somenteAdministrador,
    UsuarioController.inserirUsuarioProfessor
);

export default routes;