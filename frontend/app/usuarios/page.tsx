"use client";

import { useEffect, useState, type FormEvent } from "react";
import estilos from "./usuarios.module.css";

interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  datanascimento: string;
  celular: string;
  email: string;
  login: string;
  datacadastro: string;
}

export default function Usuario() {
  const [dados, setDados] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarDadosDosUsuarios() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        "http://localhost:8080/usuarios"
      );

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível carregar os usuários."
        );
      }

      const resultado: Usuario[] = await resposta.json();
      setDados(resultado);
    } catch (erro) {
      console.error("Erro ao carregar usuários:", erro);

      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarDadosDosUsuarios();
  }, []);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");

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

    const token = sessionStorage.getItem("token");

    if (!token) {
      setErro("Você precisa fazer login novamente.");
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
            Authorization: `Bearer ${token}`,
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
      await carregarDadosDosUsuarios();
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

          <button
            type="submit"
            className={estilos.botao}
            disabled={cadastrando}
          >
            {cadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </section>

      <section>
        <div className={estilos.cabecalhoLista}>
          <div>
            <h2 className={estilos.titulo}>
              Usuários cadastrados
            </h2>
            <p>
              Consulte as informações dos usuários registrados.
            </p>
          </div>

          <button
            type="button"
            className={estilos.botaoSecundario}
            onClick={() => void carregarDadosDosUsuarios()}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {carregando ? (
          <div className={estilos.estadoVazio}>
            Carregando usuários...
          </div>
        ) : dados.length === 0 ? (
          <div className={estilos.estadoVazio}>
            <h3>Nenhum usuário encontrado</h3>
            <p>Os usuários cadastrados aparecerão aqui.</p>
          </div>
        ) : (
          <div className={estilos.lista}>
            {dados.map((registro) => (
              <article
                key={registro.id}
                className={estilos.card}
              >
                <h3>{registro.nome}</h3>

                <p>
                  <strong>ID:</strong> {registro.id}
                </p>
                <p>
                  <strong>CPF:</strong> {registro.cpf}
                </p>
                <p>
                  <strong>Nascimento:</strong>{" "}
                  {registro.datanascimento}
                </p>
                <p>
                  <strong>Celular:</strong> {registro.celular}
                </p>
                <p>
                  <strong>E-mail:</strong> {registro.email}
                </p>
                <p>
                  <strong>Login:</strong> {registro.login}
                </p>
                <p>
                  <strong>Data de cadastro:</strong>{" "}
                  {registro.datacadastro}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


