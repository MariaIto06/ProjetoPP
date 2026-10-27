"use client";

import { useEffect, useState, type FormEvent } from "react";
import estilos from "./salas.module.css";

interface Salas {
  id: number;
  codigo: string;
  nome: string;
  capacidade: number;
  localizacao: string;
}

export default function Salas() {
  const [dados, setDados] = useState<Salas[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState("");
  const [ehProfessor, setEhProfessor] = useState(false);

  function verificarPerfil() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setEhProfessor(false);
      return;
    }

    try {
      const payload = token.split(".")[1];

      if (!payload) {
        setEhProfessor(false);
        return;
      }

      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

      const preenchido =
        base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      const usuario = JSON.parse(atob(preenchido));

      setEhProfessor(usuario.tipoUsuario === "professor");
    } catch {
      setEhProfessor(false);
    }
  }

  async function carregarSalas() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8080/salas");

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar as salas.");
      }

      const dadosRecebidos: Salas[] = await resposta.json();
      setDados(dadosRecebidos);
    } catch (erro) {
      console.error("Erro ao carregar salas:", erro);

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
    verificarPerfil();
    void carregarSalas();
  }, []);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setErro("");

    if (!ehProfessor) {
      setErro("Apenas professores podem cadastrar salas.");
      return;
    }

    const formulario = evento.currentTarget;
    const formData = new FormData(formulario);

    const novaSala = {
      codigo: String(formData.get("codigo") ?? "").trim(),
      nome: String(formData.get("nome") ?? "").trim(),
      capacidade: Number(formData.get("capacidade")),
      localizacao: String(formData.get("localizacao") ?? "").trim(),
    };

    if (
      !novaSala.codigo ||
      !novaSala.nome ||
      !novaSala.localizacao ||
      !Number.isInteger(novaSala.capacidade) ||
      novaSala.capacidade <= 0
    ) {
      setErro("Preencha todos os campos corretamente.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      setErro("Você precisa fazer login novamente.");
      return;
    }

    setCadastrando(true);

    try {
      const resposta = await fetch("http://localhost:8080/sala", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaSala),
      });

      const resultado = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        throw new Error("Você precisa fazer login novamente.");
      }

      if (resposta.status === 403) {
        setErro("Apenas professores podem cadastrar salas.");
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível cadastrar a sala."
        );
      }

      formulario.reset();

      await carregarSalas();
    } catch (erro) {
      console.error("Erro ao cadastrar sala:", erro);

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
      <h1 className={estilos.titulo}>Cadastro de Salas</h1>

      {ehProfessor && (
        <section className={estilos.container}>
          <form onSubmit={cadastrar}>
            <div className={estilos.campo}>
              <label htmlFor="codigo">Código</label>

              <input
                id="codigo"
                name="codigo"
                type="text"
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                name="nome"
                type="text"
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="capacidade">Capacidade</label>

              <input
                id="capacidade"
                name="capacidade"
                type="number"
                min="1"
                step="1"
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="localizacao">Localização</label>

              <input
                id="localizacao"
                name="localizacao"
                type="text"
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
      )}

      <section>
        <div className={estilos.cabecalhoReservas}>
          <div>
            <h2 className={estilos.titulo}>Salas cadastradas</h2>

            <p>
              Consulte os códigos, as capacidades e as localizações das salas.
            </p>
          </div>

          <button
            type="button"
            className={estilos.botaoSecundario}
            onClick={() => void carregarSalas()}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {erro && !ehProfessor && (
          <div className={estilos.mensagemErro} role="alert">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className={estilos.estadoVazio}>
            Carregando salas...
          </div>
        ) : dados.length === 0 ? (
          <div className={estilos.estadoVazio}>
            <h3>Nenhuma sala encontrada</h3>
            <p>As salas cadastradas aparecerão aqui.</p>
          </div>
        ) : (
          <div className={estilos.lista}>
            {dados.map((sala) => (
              <article key={sala.id} className={estilos.card}>
                <h3>{sala.nome}</h3>

                <p>
                  <strong>Código:</strong> {sala.codigo}
                </p>

                <p>
                  <strong>Capacidade:</strong> {sala.capacidade} pessoas
                </p>

                <p>
                  <strong>Localização:</strong> {sala.localizacao}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

