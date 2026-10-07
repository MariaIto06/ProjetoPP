"use client";

import { useEffect, useState } from "react";
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

async function carregarSalas() {
const resposta = await fetch("http://localhost:8080/salas");
const dadosRecebidos = await resposta.json();


setDados(dadosRecebidos);


}

useEffect(() => {
carregarSalas();
}, []);

async function cadastrar(
evento: React.SyntheticEvent<HTMLFormElement>
) {
evento.preventDefault();


const formulario = evento.currentTarget;
const formData = new FormData(formulario);

const novaSala = {
  codigo: formData.get("codigo"),
  nome: formData.get("nome"),
  capacidade: Number(formData.get("capacidade")),
  localizacao: formData.get("localizacao"),
};

await fetch("http://localhost:8080/sala", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(novaSala),
});

await carregarSalas();

formulario.reset();


}

return ( <div className={estilos.pagina}> 
  <h2 className={estilos.titulo}>
  Cadastro de Salas 
  </h2>

  <div className={estilos.container}>
    <form onSubmit={cadastrar}>
      <div className={estilos.campo}>
        <label>Código</label>

        <input
          name="codigo"
          required
          className={estilos.input}
        />
      </div>

      <div className={estilos.campo}>
        <label>Nome</label>

        <input
          name="nome"
          required
          className={estilos.input}
        />
      </div>

      <div className={estilos.campo}>
        <label>Capacidade</label>

        <input
          name="capacidade"
          type="number"
          required
          className={estilos.input}
        />
      </div>

      <div className={estilos.campo}>
        <label>Localização</label>

        <input
          name="localizacao"
          required
          className={estilos.input}
        />
      </div>

      <button
        type="submit"
        className={estilos.botao}
      >
        Cadastrar
      </button>
    </form>
  </div>

  <h2 className={estilos.titulo}>
    Salas cadastradas
  </h2>

  <div className={estilos.listaSalas}>
  {dados.map((sala) => (
    <div key={sala.id} className={estilos.cardSala}>
      <h3>{sala.nome}</h3>

      <p>Código: {sala.codigo}</p>

      <p>Capacidade: {sala.capacidade}</p>

      <p>Localização: {sala.localizacao}</p>
    </div>
  ))}
</div>

  <br />
  <br />
</div>


);
}
