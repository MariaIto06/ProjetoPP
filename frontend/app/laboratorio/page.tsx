"use client";

import { useEffect, useState } from "react";

interface Laboratorio {
  id: number;
  codigo: string;
  nome: string;
  capacidade: number;
  localizacao: string;
}

export default function Laboratorio() {
  const [dados, setDados] = useState<Laboratorio[]>([]);

  useEffect(() => {
    async function carregarDadosDosLaboratorios() {
      try {
        const response = await fetch(
          "http://localhost:8080/laboratorios"
        );

        if (!response.ok) {
          throw new Error(
            "Erro ao trazer os dados de todos os laboratórios"
          );
        }

        const resultado: Laboratorio[] = await response.json();

        console.log(
          "Dados dos laboratórios vindo do JSON da API"
        );
        console.log(resultado);

        setDados(resultado);
      } catch (erro) {
        console.error("Erro no processamento", erro);
      }
    }

    carregarDadosDosLaboratorios();
  }, []);

  async function cadastrar(
    evento: React.SyntheticEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    const formulario = evento.currentTarget;

    const formularioDados = new FormData(formulario);

    const novoLaboratorio = {
      codigo: formularioDados.get("codigo"),
      nome: formularioDados.get("nome"),
      capacidade: Number(
        formularioDados.get("capacidade")
      ),
      localizacao: formularioDados.get("localizacao"),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/laboratorio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoLaboratorio),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar laboratório");
      }

      alert("Laboratório cadastrado!");

      formulario.reset();

      // Atualizar a lista depois do cadastro
      const respostaLista = await fetch(
        "http://localhost:8080/laboratorios"
      );

      if (!respostaLista.ok) {
        throw new Error(
          "Erro ao atualizar a lista de laboratórios"
        );
      }

      const resultado: Laboratorio[] =
        await respostaLista.json();

      setDados(resultado);
    } catch (erro) {
      console.error("Erro no processamento", erro);
      alert("Não foi possível cadastrar o laboratório.");
    }
  }

  return (
    <div>
      <h2 className="text-center mt-5 mb-2 font-bold text-2xl">
        Cadastro de Laboratórios
      </h2>

      <div className="mx-2">
        <form onSubmit={cadastrar}>
          <div className="mb-3">
            <label>Código</label>
            <br />

            <input
              name="codigo"
              required
              className="border border-gray-400 rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label>Nome</label>
            <br />

            <input
              name="nome"
              required
              className="border border-gray-400 rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label>Capacidade</label>
            <br />

            <input
              name="capacidade"
              type="number"
              required
              className="border border-gray-400 rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label>Localização</label>
            <br />

            <input
              name="localizacao"
              required
              className="border border-gray-400 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="border border-gray-400 rounded-md p-2"
          >
            Cadastrar
          </button>
        </form>
      </div>

      <h2 className="text-center mt-5 mb-2 font-bold text-2xl">
        Laboratórios cadastrados
      </h2>

      <div className="flex flex-col gap-4 mx-2">
        {dados.map((registro) => (
          <div
            key={registro.id}
            className="bg-gray-200 p-4 rounded-md"
          >
            <h4>ID: {registro.id}</h4>

            <h2 className="font-bold">
              Código: {registro.codigo}
            </h2>

            <p>Nome: {registro.nome}</p>

            <p>Capacidade: {registro.capacidade}</p>

            <p>Localização: {registro.localizacao}</p>
          </div>
        ))}
      </div>

      <br />
      <br />
    </div>
  );
}

