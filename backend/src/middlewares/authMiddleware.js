import jwt from "jsonwebtoken";

const autenticar = (req, res, next) => {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    const token = cabecalho.split(" ")[1];

    try {
        const dados = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = dados;

        next();
    } catch (erro) {
        return res.status(401).json({
            message: "Token inválido ou expirado"
        });
    }
};

const somenteProfessor = (req, res, next) => {
    if (req.usuario?.tipoUsuario !== "professor") {
        return res.status(403).json({
            message: "Acesso permitido apenas para professores"
        });
    }

    next();
};

export { autenticar, somenteProfessor };
