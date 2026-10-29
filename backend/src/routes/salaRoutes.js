import express from "express";
import SalaController from "../controllers/SalaController.js";
import {autenticar, somenteProfessor} from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.get("/salas", SalaController.listarSalas);
routes.post("/sala", autenticar, somenteProfessor, SalaController.inserirSala);

routes.put("/sala/:id",autenticar,somenteProfessor,SalaController.alterarSala);
routes.delete("/sala/:id",autenticar,somenteProfessor,SalaController.excluirSala);

export default routes;
