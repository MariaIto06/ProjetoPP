"use client";

import { FormEvent, useEffect, useState } from "react";

interface Salas {
  id: number;
  codigo: string;
  nome: string;
  capacidade: number;
  localizacao: string;
}

export default function Salas() {
  const [dados, setDados] = useState<Salas[]>([]);

  async function carregarSalas(){
    const resposta = await fetch("https://localhost:8080/salas");
    const dadosRecebidos = await resposta.json();

    setDados(dadosRecebidos);
  }

  useEffect(() => {
    carregarSalas();
  },[]);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const formData = new FormData(formulario);

    const novaSala = {
      codigo: formData.get("codigo"),
      nome: formData.get("nome"),
      capacidade: Number(formData.get("capacidade")),
      localizacao: formData.get("localizacao")
    };

    await fetch("https://localhost:8080/sala", {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify(novaSala)
      });

    await carregarSalas();

    formulario.reset();

  }
  return (
    <main>
      <h1>Cadastro de Salas</h1>
      <form onSubmit={cadastrar}>
        <label>Código</label>
        <input type="text" name="codigo" />

        <label>Nome</label>
        <input type="text" name="nome" />

        <label>Capacidade</label>
        <input type="number" name="capacidade" />

        <label>Localização</label>
        <input type="text" name="localizacao" />

        <button type="submit">Cadastrar</button>
      </form>

      <h2>Salas cadastradas</h2>

      {dados.map((sala) => (
        <div key={sala.id}>
          <p>{sala.codigo}</p>
          <p>{sala.nome}</p>
          <p>{sala.capacidade}</p>
          <p>{sala.localizacao}</p>
        </div>
      ))}
    </main>
  );
}