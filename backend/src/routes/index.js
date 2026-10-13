import express from "express";

import laboratorios from "./laboratoriosRoutes.js";
import salas from "./salasRoutes.js";
import usuarios from "./usuariosRoutes.js";
import status from "./statusRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) =>
        res.status(200).send("API Projeto PP")
    );

    app.use(
        express.json(),
        laboratorios,
        salas,
        usuarios,
        status
    );
};

export default routes;
