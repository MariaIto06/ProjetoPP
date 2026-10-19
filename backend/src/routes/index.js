import express from "express";

import laboratorios from "./labRoutes.js";
import salas from "./salaRoutes.js";
import usuarios from "./usuarioRoutes.js";
import status from "./statusRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) =>
        res.status(200).send("API Projeto PP")
    );

    app.use(
        express.json(),
        laboratorios,
        salas,
        usuarios,
        status,
        authRoutes
    );
};
export default routes;