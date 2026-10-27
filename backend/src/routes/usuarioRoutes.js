import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import {
    autenticar,
    somenteProfessor
} from "../middlewares/authMiddleware.js";

const routes = express.Router();

// Somente professores podem consultar os usuários
routes.get(
    "/usuarios",
    autenticar,
    somenteProfessor,
    UsuarioController.listarUsuarios
);

// Cadastro público: cria apenas alunos
routes.post(
    "/usuario",
    UsuarioController.inserirUsuario
);

// Cadastro administrativo: somente professores
routes.post(
    "/usuarios/administrativo",
    autenticar,
    somenteProfessor,
    UsuarioController.inserirUsuarioProfessor
);

export default routes;