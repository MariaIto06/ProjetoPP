import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const routes = express.Router();

routes.get("/usuarios", UsuarioController.listarUsuarios);
routes.post("/usuario", UsuarioController.inserirUsuario);

export default routes;
