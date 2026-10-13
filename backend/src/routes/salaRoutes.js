import express from "express";
import SalaController from "../controllers/SalaController.js";

const routes = express.Router();

routes.get("/salas", SalaController.listarSalas);
routes.post("/sala", SalaController.inserirSala);

export default routes;
