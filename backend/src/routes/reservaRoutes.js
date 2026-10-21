import express from "express";
import ReservaController from "../controllers/ReservaController.js";
import {
    autenticar,
    somenteProfessor
} from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.get(
    "/reservas",
    autenticar,
    ReservaController.listarReservas
);

routes.post(
    "/reservas",
    autenticar,
    somenteProfessor,
    ReservaController.inserirReserva
);

export default routes;