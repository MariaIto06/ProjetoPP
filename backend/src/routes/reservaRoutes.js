import express from "express";
import ReservaController from "../controllers/ReservaController.js";
import {
    autenticar,
    somenteProfessor
} from "../middlewares/authMiddleware.js";

const routes = express.Router();

// Consultar reservas: qualquer usuário autenticado
routes.get(
    "/reservas",
    autenticar,
    ReservaController.listarReservas
);

// Cadastrar reserva: somente professores
routes.post(
    "/reservas",
    autenticar,
    somenteProfessor,
    ReservaController.inserirReserva
);

// Editar reserva: somente professores
routes.put(
    "/reservas/:id",
    autenticar,
    somenteProfessor,
    ReservaController.atualizarReserva
);

// Excluir reserva: somente professores
routes.delete(
    "/reservas/:id",
    autenticar,
    somenteProfessor,
    ReservaController.excluirReserva
);

export default routes;
