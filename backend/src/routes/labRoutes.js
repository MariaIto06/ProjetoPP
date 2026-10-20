import express from "express";
import LabController from "../controllers/LabController.js";
import { autenticar, somenteProfessor } from "../middlewares/authMiddleware.js";


const routes = express.Router();

routes.get("/laboratorios", LabController.listarLaboratorios);
routes.post("/laboratorio",autenticar, somenteProfessor, LabController.inserirLaboratorio);

export default routes;
