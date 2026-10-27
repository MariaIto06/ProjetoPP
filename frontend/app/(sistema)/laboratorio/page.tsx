"use client";

import { useEffect, useState, type FormEvent } from "react";
import estilos from "./laboratorios.module.css";

interface Laboratorio {
  id: number;
  codigo: string;
  nome: string;
  capacidade: number;
  localizacao: string;
}

export default function Laboratorio() {
  const [dados, setDados] = useState<Laboratorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState("");
  const [laboratorioEditando, setLaboratorioEditando] =
    useState<Laboratorio | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
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

  async function carregarDadosDosLaboratorios() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        "http://localhost:8080/laboratorios"
      );

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível carregar os laboratórios."
        );
      }

      const resultado: Laboratorio[] = await resposta.json();
      setDados(resultado);
    } catch (erro) {
      console.error("Erro ao carregar laboratórios:", erro);

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
    void carregarDadosDosLaboratorios();
  }, []);

  async function excluirLaboratorio(id: number) {
    if (!ehProfessor) {
      alert("Apenas professores podem excluir laboratórios.");
      return;
    }

    const confirmou = window.confirm(
      "Tem certeza que deseja excluir este laboratório?"
    );

    if (!confirmou) {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Você precisa fazer login novamente.");
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:8080/laboratorio/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resposta.status === 401) {
        alert("Você precisa fazer login novamente.");
        return;
      }

      if (resposta.status === 403) {
        alert("Apenas professores podem excluir laboratórios.");
        return;
      }

      if (!resposta.ok) {
        alert("Não foi possível excluir o laboratório.");
        return;
      }

      alert("Laboratório excluído com sucesso!");

      await carregarDadosDosLaboratorios();
    } catch (erro) {
      console.error("Erro ao excluir laboratório:", erro);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  async function salvarEdicao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!ehProfessor) {
      alert("Apenas professores podem alterar laboratórios.");
      return;
    }

    if (!laboratorioEditando) {
      return;
    }

    const formulario = evento.currentTarget;
    const formData = new FormData(formulario);

    const laboratorioAtualizado = {
      codigo: String(formData.get("codigo") ?? "").trim(),
      nome: String(formData.get("nome") ?? "").trim(),
      capacidade: Number(formData.get("capacidade")),
      localizacao: String(formData.get("localizacao") ?? "").trim(),
    };

    if (
      !laboratorioAtualizado.codigo ||
      !laboratorioAtualizado.nome ||
      !laboratorioAtualizado.localizacao ||
      !Number.isInteger(laboratorioAtualizado.capacidade) ||
      laboratorioAtualizado.capacidade <= 0
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Você precisa fazer login novamente.");
      return;
    }

    setSalvandoEdicao(true);

    try {
      const resposta = await fetch(
        `http://localhost:8080/laboratorio/${laboratorioEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(laboratorioAtualizado),
        }
      );

      if (resposta.status === 401) {
        alert("Você precisa fazer login novamente.");
        return;
      }

      if (resposta.status === 403) {
        alert("Apenas professores podem alterar laboratórios.");
        return;
      }

      if (!resposta.ok) {
        alert("Não foi possível alterar o laboratório.");
        return;
      }

      alert("Laboratório alterado com sucesso!");

      setLaboratorioEditando(null);
      await carregarDadosDosLaboratorios();
    } catch (erro) {
      console.error("Erro ao alterar laboratório:", erro);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");

    if (!ehProfessor) {
      setErro("Apenas professores podem cadastrar laboratórios.");
      return;
    }

    const formulario = evento.currentTarget;
    const formularioDados = new FormData(formulario);

    const novoLaboratorio = {
      codigo: String(formularioDados.get("codigo") ?? "").trim(),
      nome: String(formularioDados.get("nome") ?? "").trim(),
      capacidade: Number(formularioDados.get("capacidade")),
      localizacao: String(formularioDados.get("localizacao") ?? "").trim(),
    };

    if (
      !novoLaboratorio.codigo ||
      !novoLaboratorio.nome ||
      !novoLaboratorio.localizacao ||
      !Number.isInteger(novoLaboratorio.capacidade) ||
      novoLaboratorio.capacidade <= 0
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
      const resposta = await fetch(
        "http://localhost:8080/laboratorio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novoLaboratorio),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        throw new Error(
          "Você precisa estar autenticado para cadastrar."
        );
      }

      if (resposta.status === 403) {
        setErro("Apenas professores podem cadastrar laboratórios.");
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.message ||
            "Não foi possível cadastrar o laboratório."
        );
      }

      formulario.reset();
      await carregarDadosDosLaboratorios();
    } catch (erro) {
      console.error("Erro ao cadastrar laboratório:", erro);

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
        Cadastro de Laboratórios
      </h1>

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

      {ehProfessor && laboratorioEditando && (
        <section className={estilos.container}>
          <h2 className={estilos.titulo}>
            Editar laboratório
          </h2>

          <form
            key={laboratorioEditando.id}
            onSubmit={salvarEdicao}
          >
            <div className={estilos.campo}>
              <label htmlFor="editarCodigo">Código</label>
              <input
                id="editarCodigo"
                name="codigo"
                type="text"
                defaultValue={laboratorioEditando.codigo}
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="editarNome">Nome</label>
              <input
                id="editarNome"
                name="nome"
                type="text"
                defaultValue={laboratorioEditando.nome}
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="editarCapacidade">Capacidade</label>
              <input
                id="editarCapacidade"
                name="capacidade"
                type="number"
                min="1"
                step="1"
                defaultValue={laboratorioEditando.capacidade}
                className={estilos.input}
                required
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="editarLocalizacao">Localização</label>
              <input
                id="editarLocalizacao"
                name="localizacao"
                type="text"
                defaultValue={laboratorioEditando.localizacao}
                className={estilos.input}
                required
              />
            </div>

            <button
              type="submit"
              className={estilos.botao}
              disabled={salvandoEdicao}
            >
              {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
            </button>

            <button
              type="button"
              className={estilos.botaoSecundario}
              onClick={() => setLaboratorioEditando(null)}
              disabled={salvandoEdicao}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}

      <section>
        <div className={estilos.cabecalhoReservas}>
          <div>
            <h2 className={estilos.titulo}>
              Laboratórios cadastrados
            </h2>

            <p>
              Consulte os códigos, as capacidades e as localizações
              dos laboratórios.
            </p>
          </div>

          <button
            type="button"
            className={estilos.botaoSecundario}
            onClick={() => void carregarDadosDosLaboratorios()}
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
            Carregando laboratórios...
          </div>
        ) : dados.length === 0 ? (
          <div className={estilos.estadoVazio}>
            <h3>Nenhum laboratório encontrado</h3>
            <p>
              Os laboratórios cadastrados aparecerão aqui.
            </p>
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
                  <strong>Código:</strong> {registro.codigo}
                </p>

                <p>
                  <strong>Capacidade:</strong>{" "}
                  {registro.capacidade} pessoas
                </p>

                <p>
                  <strong>Localização:</strong>{" "}
                  {registro.localizacao}
                </p>

                {ehProfessor && (
                  <>
                    <button
                      type="button"
                      className={estilos.botaoSecundario}
                      onClick={() => setLaboratorioEditando(registro)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={estilos.botaoSecundario}
                      onClick={() => void excluirLaboratorio(registro.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

