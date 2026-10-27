"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import estilos from "./usuarios.module.css";


export default function Usuario() {
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");


  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    const formulario = evento.currentTarget;
    const formularioDados = new FormData(formulario);

    const novoUsuario = {
      cpf: String(formularioDados.get("cpf") ?? "").trim(),
      nome: String(formularioDados.get("nome") ?? "").trim(),
      datanascimento: String(
        formularioDados.get("datanascimento") ?? ""
      ),
      celular: String(
        formularioDados.get("celular") ?? ""
      ).trim(),
      email: String(
        formularioDados.get("email") ?? ""
      ).trim(),
      login: String(
        formularioDados.get("login") ?? ""
      ).trim(),
      senha: String(formularioDados.get("senha") ?? ""),
    };

    if (
      !novoUsuario.cpf ||
      !novoUsuario.nome ||
      !novoUsuario.datanascimento ||
      !novoUsuario.celular ||
      !novoUsuario.email ||
      !novoUsuario.login ||
      !novoUsuario.senha
    ) {
      setErro("Preencha todos os campos.");
      return;
    }


    setCadastrando(true);

    try {
      const resposta = await fetch(
        "http://localhost:8080/usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoUsuario),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente."
        );
      }

      if (resposta.status === 403) {
        throw new Error(
          "Você não tem permissão para cadastrar usuários."
        );
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.message ||
            "Não foi possível cadastrar o usuário."
        );
      }

    formulario.reset();
    setSucesso("Cadastro realizado com sucesso! Agora você pode fazer login.");

    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);

      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <main className={estilos.pagina}>
      <h1 className={estilos.titulo}>
        Cadastro de Usuários
      </h1>

      <section className={estilos.container}>
        <form onSubmit={cadastrar}>
          <div className={estilos.campo}>
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              autoComplete="off"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="datanascimento">
              Data de nascimento
            </label>
            <input
              id="datanascimento"
              name="datanascimento"
              type="date"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="celular">Celular</label>
            <input
              id="celular"
              name="celular"
              type="tel"
              autoComplete="tel"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="login">Login</label>
            <input
              id="login"
              name="login"
              type="text"
              autoComplete="off"
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              className={estilos.input}
              required
            />
          </div>

          {erro && (
            <div className={estilos.mensagemErro} role="alert">
              {erro}
            </div>
          )}
          {sucesso && (
            <p role="status">{sucesso}</p>
          )}

          <button
            type="submit"
            className={estilos.botao}
            disabled={cadastrando}
          >
            {cadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <p>
          Já tem uma conta? <Link href="/">Voltar para o login</Link>
        </p>
      </section>

      
    </main>
  );
}


