
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import estilos from "../../usuarios/usuarios.module.css";

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

type Perfil = "aluno" | "professor";

function obterPerfil(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const dados = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return dados.tipoUsuario ?? null;
  } catch {
    return null;
  }
}

export default function GerenciarUsuarios() {
  const router = useRouter();

  const [autorizado, setAutorizado] = useState(false);
  const [dados, setDados] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<Perfil>("aluno");

  async function carregarUsuarios(token: string) {
    setCarregando(true);

    try {
      const resposta = await fetch(
        "http://localhost:8080/usuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resposta.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (resposta.status === 403) {
        throw new Error("Acesso permitido apenas para professores.");
      }

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os usuários.");
      }

      const resultado: Usuario[] = await resposta.json();
      setDados(resultado);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao conectar ao servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    if (obterPerfil(token) !== "professor") {
      router.replace("/laboratorio");
      return;
    }

    setAutorizado(true);
    void carregarUsuarios(token);
  }, [router]);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    const token = sessionStorage.getItem("token");

    if (!token || obterPerfil(token) !== "professor") {
      setErro("Acesso permitido apenas para professores.");
      return;
    }

    const formulario = evento.currentTarget;
    const formularioDados = new FormData(formulario);

    const novoUsuario = {
      cpf: String(formularioDados.get("cpf") ?? "").trim(),
      nome: String(formularioDados.get("nome") ?? "").trim(),
      datanascimento: String(
        formularioDados.get("datanascimento") ?? ""
      ),
      celular: String(formularioDados.get("celular") ?? "").trim(),
      email: String(formularioDados.get("email") ?? "").trim(),
      login: String(formularioDados.get("login") ?? "").trim(),
      senha: String(formularioDados.get("senha") ?? ""),
      tipoUsuario,
    };

    if (Object.values(novoUsuario).some((valor) => !valor)) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCadastrando(true);

    try {
      const resposta = await fetch(
        "http://localhost:8080/usuarios/administrativo",
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

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível cadastrar o usuário."
        );
      }

      formulario.reset();
      setTipoUsuario("aluno");
      setSucesso("Usuário cadastrado com sucesso!");
      await carregarUsuarios(token);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao conectar ao servidor."
      );
    } finally {
      setCadastrando(false);
    }
  }

  if (!autorizado) {
    return <main className={estilos.pagina}>Verificando acesso...</main>;
  }

  return (
    <main className={estilos.pagina}>
      <h1 className={estilos.titulo}>Gerenciar usuários</h1>

      <section className={estilos.container}>
        <h2>Cadastrar usuário</h2>

        <form onSubmit={cadastrar}>
          <div className={estilos.campo}>
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
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
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="datanascimento">Data de nascimento</label>
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
              className={estilos.input}
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="tipoUsuario">Tipo de usuário</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              className={estilos.input}
              value={tipoUsuario}
              onChange={(evento) =>
                setTipoUsuario(evento.target.value as Perfil)
              }
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>
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
            {cadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </section>

      <section>
        <div className={estilos.cabecalhoLista}>
          <div>
            <h2 className={estilos.titulo}>Usuários cadastrados</h2>
            <p>Lista disponível somente para professores.</p>
          </div>

          <button
            type="button"
            className={estilos.botaoSecundario}
            onClick={() => {
              const token = sessionStorage.getItem("token");
              if (token) void carregarUsuarios(token);
            }}
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
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div className={estilos.lista}>
            {dados.map((registro) => (
              <article key={registro.id} className={estilos.card}>
                <h3>{registro.nome}</h3>
                <p><strong>ID:</strong> {registro.id}</p>
                <p><strong>CPF:</strong> {registro.cpf}</p>
                <p><strong>Nascimento:</strong> {registro.datanascimento}</p>
                <p><strong>Celular:</strong> {registro.celular}</p>
                <p><strong>E-mail:</strong> {registro.email}</p>
                <p><strong>Login:</strong> {registro.login}</p>
                <p><strong>Data de cadastro:</strong> {registro.datacadastro}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
