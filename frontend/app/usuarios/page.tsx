"use client";

import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  datanascimento: string;
  celular: string;
  email: string;
  login: string;
  senha: string;
  datacadastro: string;
}

export default function Usuario() {
  const [dados, setDados] = useState<Usuario[]>([]);

  useEffect(() => { //busca de dados na api 
    async function carregarDadosDosUsuarios() {
        try {
            const response = await fetch(
                "http://localhost:8080/usuarios"
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao trazer os dados de todos os usuários"
                );
            }

            const resultado: Usuario[] = await response.json();   

            setDados(resultado);

        } catch (erro) {
            console.error("Erro no processamento", erro);
        }
    }

    carregarDadosDosUsuarios();
}, []);

  async function cadastrar(
    evento: React.SyntheticEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    const formulario = evento.currentTarget;

    const formularioDados = new FormData(formulario);

    const novoUsuario = {
    senha: formularioDados.get("senha"),
    nome: formularioDados.get("nome"),
    cpf: formularioDados.get("cpf"),
    datanascimento: formularioDados.get("datanascimento"),
    celular: formularioDados.get("celular"),
    email: formularioDados.get("email"),
    login: formularioDados.get("login")
};

    try {
      const response = await fetch(
        "http://localhost:8080/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoUsuario),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      alert("Usuario cadastrado!");

      formulario.reset();

      // Atualizar a lista depois do cadastro   
      const respostaLista = await fetch(
        "http://localhost:8080/usuarios"
      );

      if (!respostaLista.ok) {
        throw new Error(
          "Erro ao atualizar a lista de usuarios"
        );
      }

      const resultado: Usuario[] =
        await respostaLista.json();

      setDados(resultado);
    } catch (erro) {
      console.error("Erro no processamento", erro);
      alert("Não foi possível cadastrar o Usuário.");
    }
  }

 return (
  <div>
    <h2 className="text-center mt-5 mb-2 font-bold text-2xl">
      Cadastro de Usuários
    </h2>

    <div className="mx-2">
      <form onSubmit={cadastrar}>
        <div className="mb-3">
          <label>CPF</label>
          

          <input
            name="cpf"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>Nome completo</label>
          

          <input
            name="nome"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>Data de nascimento</label>
        

          <input
            name="datanascimento"
            type="date"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>Celular</label>
         

          <input
            name="celular"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>E-mail</label>
          

          <input
            name="email"
            type="email"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>Login</label>
          

          <input
            name="login"
            required
            className="border border-gray-400 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label>Senha</label>
         

          <input
            name="senha"
            type="password"
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
      Usuários cadastrados
    </h2>

    <div className="flex flex-col gap-4 mx-2">
      {dados.map((registro) => (
        <div
          key={registro.id}
          className="bg-gray-200 p-4 rounded-md"
        >
          <h4>ID: {registro.id}</h4>

          <p>CPF: {registro.cpf}</p>
          <p>Nome: {registro.nome}</p>
          <p>Data de nascimento: {registro.datanascimento}</p>
          <p>Celular: {registro.celular}</p>
          <p>E-mail: {registro.email}</p>
          <p>Login: {registro.login}</p>
        </div>
      ))}
    </div>

    <br />
    <br />
  </div>
);
}

