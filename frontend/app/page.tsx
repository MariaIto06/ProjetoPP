"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import estilos from "./login.module.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setErro("");
    setCarregando(true);

    const formulario = evento.currentTarget;
    const formularioDados = new FormData(formulario);

    const usuario = {
      login: formularioDados.get("login"),
      senha: formularioDados.get("senha"),
    };

    try {
      const response = await fetch("http://localhost:8080", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const resultado = await response.json();

      if (!response.ok) {
        setErro(resultado.message || "Login ou senha inválidos.");
        return;
      }

      if (!resultado.token) {
        setErro("O servidor não retornou um token de autenticação.");
        return;
      }

      sessionStorage.setItem("token", resultado.token);

      router.push("/laboratorio");
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={estilos.paginaLogin}>
      <section className={estilos.cartaoLogin}>
        <div className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Entrar no sistema</h1>
          <p className={estilos.subtitulo}>
            Acesse sua conta para continuar.
          </p>
        </div>

        <form className={estilos.formulario} onSubmit={entrar}>
          <div className={estilos.campo}>
            <label htmlFor="login">Login</label>
            <input
              className={estilos.input}
              id="login"
              name="login"
              type="text"
              placeholder="Digite seu login"
              autoComplete="username"
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="senha">Senha</label>
            <input
              className={estilos.input}
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && (
            <p className={estilos.mensagemErro} role="alert">
              {erro}
            </p>
          )}

          <button
            className={estilos.botao}
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={estilos.rodape}>
          <p>Ainda não tem cadastro?</p>

          <button
            className={estilos.botaoSecundario}
            type="button"
            onClick={() => router.push("/usuarios")}
          >
            Cadastrar usuário
          </button>
        </div>
      </section>
    </main>
  );
}
