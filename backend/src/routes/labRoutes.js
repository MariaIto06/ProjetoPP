import express from "express";
import LaboratorioController from "../controllers/LaboratorioController.js";

const routes = express.Router();

routes.get("/laboratorios", LaboratorioController.listarLaboratorios);
routes.post("/laboratorio", LaboratorioController.inserirLaboratorio);

export default routes;
