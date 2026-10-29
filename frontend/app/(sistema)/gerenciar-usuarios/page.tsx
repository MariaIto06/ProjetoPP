
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import estilos from "../../usuarios/usuarios.module.css";

type Perfil = "aluno" | "professor" | "administrador";
type PerfilEditavel = "aluno" | "professor";

interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  datanascimento: string;
  celular: string;
  email: string;
  login: string;
  datacadastro: string;
  tipoUsuario: Perfil;
}

function obterPerfil(token: string): Perfil | null {
  try {
    const payload = token.split(".")[1];
    const dados = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (
      dados.tipoUsuario === "aluno" ||
      dados.tipoUsuario === "professor" ||
      dados.tipoUsuario === "administrador"
    ) {
      return dados.tipoUsuario;
    }

    return null;
  } catch {
    return null;
  }
}

export default function GerenciarUsuarios() {
  const router = useRouter();

  const [autorizado, setAutorizado] = useState(false);
  const [ehAdministrador, setEhAdministrador] = useState(false);
  const [dados, setDados] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const [alterandoId, setAlterandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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
        throw new Error(
          "Você não tem permissão para consultar usuários."
        );
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

    const perfil = obterPerfil(token);

    if (perfil !== "professor" && perfil !== "administrador") {
      router.replace("/laboratorio");
      return;
    }

    setEhAdministrador(perfil === "administrador");
    setAutorizado(true);

    void carregarUsuarios(token);
  }, [router]);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    const token = sessionStorage.getItem("token");
    const perfil = token ? obterPerfil(token) : null;

    if (
      !token ||
      (perfil !== "professor" && perfil !== "administrador")
    ) {
      setErro("Você não tem permissão para cadastrar usuários.");
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
          resultado.message || "Não foi possível cadastrar o aluno."
        );
      }

      formulario.reset();
      setSucesso("Aluno cadastrado com sucesso!");
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

  async function alterarPerfil(
    id: number,
    tipoUsuario: PerfilEditavel
  ) {
    const token = sessionStorage.getItem("token");

    if (!token || !ehAdministrador) {
      setErro("Você não tem permissão para alterar perfis.");
      return;
    }

    const usuario = dados.find((item) => item.id === id);

    if (!usuario) {
      setErro("Usuário não encontrado na lista.");
      return;
    }

    if (usuario.tipoUsuario === "administrador") {
      setErro("Não é possível alterar administradores por esta página.");
      return;
    }

    if (usuario.tipoUsuario === tipoUsuario) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja alterar o perfil de ${usuario.nome} para ${tipoUsuario}?`
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");
    setAlterandoId(id);

    try {
      const resposta = await fetch(
        `http://localhost:8080/usuarios/${id}/perfil`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tipoUsuario }),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível alterar o perfil."
        );
      }

      setSucesso(`Perfil de ${usuario.nome} atualizado com sucesso!`);
      await carregarUsuarios(token);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setAlterandoId(null);
    }
  }

  if (!autorizado) {
    return (
      <main className={estilos.pagina}>
        Verificando acesso...
      </main>
    );
  }

  return (
    <main className={estilos.pagina}>
      <h1 className={estilos.titulo}>Gerenciar usuários</h1>

      <section className={estilos.container}>
        <h2>Cadastrar aluno</h2>
        <p>
          Professores e administradores podem cadastrar novos alunos.
          Somente administradores podem alterar os perfis depois.
        </p>

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
            {cadastrando ? "Cadastrando..." : "Cadastrar aluno"}
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
              Professores podem consultar os usuários.
              Administradores também podem alterar perfis.
            </p>
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
              <article
                key={registro.id}
                className={estilos.card}
              >
                <h3>{registro.nome}</h3>

                <p><strong>ID:</strong> {registro.id}</p>
                <p><strong>CPF:</strong> {registro.cpf}</p>
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
                <p>
                  <strong>Perfil:</strong>{" "}
                  {registro.tipoUsuario === "administrador"
                    ? "Administrador"
                    : registro.tipoUsuario === "professor"
                      ? "Professor"
                      : "Aluno"}
                </p>

                {ehAdministrador &&
                  registro.tipoUsuario !== "administrador" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                      }}
                    >
                      {registro.tipoUsuario !== "professor" && (
                        <button
                          type="button"
                          className={estilos.botaoSecundario}
                          disabled={alterandoId !== null}
                          onClick={() =>
                            alterarPerfil(registro.id, "professor")
                          }
                        >
                          {alterandoId === registro.id
                            ? "Alterando..."
                            : "Tornar professor"}
                        </button>
                      )}

                      {registro.tipoUsuario !== "aluno" && (
                        <button
                          type="button"
                          className={estilos.botaoSecundario}
                          disabled={alterandoId !== null}
                          onClick={() =>
                            alterarPerfil(registro.id, "aluno")
                          }
                        >
                          {alterandoId === registro.id
                            ? "Alterando..."
                            : "Tornar aluno"}
                        </button>
                      )}
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
