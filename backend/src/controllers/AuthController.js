import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
    static async login(req, res) {
        try {
            const { login, senha } = req.body;

            // 1. Verifica se os campos foram informados
            if (!login || !senha) {
                return res.status(400).json({
                    message: "Informe o login e a senha"
                });
            }

            // 2. Busca o usuário pelo login
            const usuario = await Usuario.buscarPorLogin(login);

            if (!usuario) {
                return res.status(401).json({
                    message: "Login ou senha inválidos"
                });
            }

            // 3. Compara a senha digitada com o hash do banco
             const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    message: "Login ou senha inválidos"
                });
            }

            // 4. Gera o token após validar as credenciais
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET não configurado");
            }

           const token = jwt.sign(
                {
                    id: usuario.id,
                    tipoUsuario: usuario.tipoUsuario
                },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            // 5. Devolve o token ao frontend
            return res.status(200).json({
                message: "Login realizado com sucesso",
                token: token
            });

        } catch (erro) {
            console.error("Erro no login:", erro);

            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }
}

export default AuthController;
