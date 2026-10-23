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
    void carregarDadosDosLaboratorios();
  }, []);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");

    const formulario = evento.currentTarget;
    const formularioDados = new FormData(formulario);

    const novoLaboratorio = {
      codigo: String(
        formularioDados.get("codigo") ?? ""
      ).trim(),
      nome: String(
        formularioDados.get("nome") ?? ""
      ).trim(),
      capacidade: Number(
        formularioDados.get("capacidade")
      ),
      localizacao: String(
        formularioDados.get("localizacao") ?? ""
      ).trim(),
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
        setErro("Apenas professores podem cadastrar salas.");
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
