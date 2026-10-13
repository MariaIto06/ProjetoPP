import express from "express";
import LabController from "../controllers/LabController.js";

const routes = express.Router();

routes.get("/laboratorios", LabController.listarLaboratorios);
routes.post("/laboratorio", LabController.inserirLaboratorio);

export default routes;
