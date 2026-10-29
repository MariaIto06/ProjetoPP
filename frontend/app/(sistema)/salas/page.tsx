
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
  const [sucesso, setSucesso] = useState("");
  const [ehProfessor, setEhProfessor] = useState(false);

  const [salaEditando, setSalaEditando] = useState<number | null>(null);

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

      setEhProfessor(
        usuario.tipoUsuario === "professor" ||
        usuario.tipoUsuario === "administrador"
      );
    } catch {
      setEhProfessor(false);
    }
  }

  async function carregarSalas() {
    setCarregando(true);

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

  function editarSala(sala: Salas) {
    setSalaEditando(sala.id);
    setErro("");
    setSucesso("");

    const codigo = document.getElementById("codigo") as HTMLInputElement;
    const nome = document.getElementById("nome") as HTMLInputElement;
    const capacidade = document.getElementById("capacidade") as HTMLInputElement;
    const localizacao = document.getElementById("localizacao") as HTMLInputElement;

    if (codigo && nome && capacidade && localizacao) {
      codigo.value = sala.codigo;
      nome.value = sala.nome;
      capacidade.value = String(sala.capacidade);
      localizacao.value = sala.localizacao;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setSalaEditando(null);
    setErro("");

    const formulario = document.getElementById(
      "formularioSala"
    ) as HTMLFormElement;

    formulario?.reset();
  }

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setErro("");
    setSucesso("");

    if (!ehProfessor) {
      setErro("Apenas professores e administradores podem salvar salas.");
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
      const editando = salaEditando !== null;

      const url = editando
        ? `http://localhost:8080/sala/${salaEditando}`
        : "http://localhost:8080/sala";

      const resposta = await fetch(url, {
        method: editando ? "PUT" : "POST",
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
        throw new Error(
          "Apenas professores e administradores podem salvar salas."
        );
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível salvar a sala."
        );
      }

      formulario.reset();
      setSalaEditando(null);

      await carregarSalas();

      setSucesso(
        editando
          ? "Sala atualizada com sucesso!"
          : "Sala cadastrada com sucesso!"
      );
    } catch (erro) {
      console.error("Erro ao salvar sala:", erro);

      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setCadastrando(false);
    }
  }

  async function excluirSala(id: number) {
    if (!ehProfessor) {
      setErro("Você não tem permissão para excluir salas.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta sala?"
    );

    if (!confirmar) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
      setErro("Você precisa fazer login novamente.");
      return;
    }

    setErro("");
    setSucesso("");

    try {
      const resposta = await fetch(
        `http://localhost:8080/sala/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível excluir a sala."
        );
      }

      if (salaEditando === id) {
        cancelarEdicao();
      }

      await carregarSalas();
      setSucesso("Sala excluída com sucesso!");
    } catch (erro) {
      console.error("Erro ao excluir sala:", erro);

      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor."
      );
    }
  }

  return (
    <main className={estilos.pagina}>
      <h1 className={estilos.titulo}>Cadastro de Salas</h1>

      {ehProfessor && (
        <section className={estilos.container}>
          <h2>
            {salaEditando !== null
              ? "Editar sala"
              : "Cadastrar sala"}
          </h2>

          <form id="formularioSala" onSubmit={cadastrar}>
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

            {sucesso && <p role="status">{sucesso}</p>}

            <button
              type="submit"
              className={estilos.botao}
              disabled={cadastrando}
            >
              {cadastrando
                ? "Salvando..."
                : salaEditando !== null
                  ? "Salvar alterações"
                  : "Cadastrar"}
            </button>

            {salaEditando !== null && (
              <button
                type="button"
                className={estilos.botaoSecundario}
                onClick={cancelarEdicao}
              >
                Cancelar edição
              </button>
            )}
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

                {ehProfessor && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      type="button"
                      className={estilos.botaoSecundario}
                      onClick={() => editarSala(sala)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={estilos.botaoSecundario}
                      onClick={() => excluirSala(sala.id)}
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
