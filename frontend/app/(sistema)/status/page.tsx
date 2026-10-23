"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./status.module.css";

interface Recurso {
  id: number;
  codigo: string;
  nome: string;
}

interface Reserva {
  id: number;
  idSala: number | null;
  idLaboratorio: number | null;
  idUsuario: number;
  inicio: string;
  fim: string;
  statusReserva: string;
  nomeUsuario: string;
  codigoSala: string | null;
  nomeSala: string | null;
  codigoLaboratorio: string | null;
  nomeLaboratorio: string | null;
}

interface ResultadoAPI {
  message?: string;
}

async function lerResposta(resposta: Response): Promise<any> {
  const texto = await resposta.text();

  if (!texto) {
    return {};
  }

  try {
    return JSON.parse(texto);
  } catch {
    return { message: texto };
  }
}

export default function Status() {
  const [dados, setDados] = useState<Reserva[]>([]);
  const [salas, setSalas] = useState<Recurso[]>([]);
  const [laboratorios, setLaboratorios] = useState<Recurso[]>([]);

  const [tipoRecurso, setTipoRecurso] = useState("sala");
  const [idRecurso, setIdRecurso] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [excluindo, setExcluindo] = useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ehProfessor, setEhProfessor] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

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

      const base64 = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const preenchido =
        base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      const usuario = JSON.parse(atob(preenchido));

      setEhProfessor(usuario.tipoUsuario === "professor");
    } catch {
      setEhProfessor(false);
    }
  }

  async function carregarReservas() {
    setCarregando(true);
    setErro("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Faça login para consultar as reservas.");
      }

      const resposta = await fetch("http://localhost:8080/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultado = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível carregar as reservas."
        );
      }

      if (!Array.isArray(resultado)) {
        throw new Error("A API retornou uma lista de reservas inválida.");
      }

      setDados(resultado);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao consultar as reservas."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function carregarRecursos() {
    try {
      const [respostaSalas, respostaLaboratorios] = await Promise.all([
        fetch("http://localhost:8080/salas"),
        fetch("http://localhost:8080/laboratorios"),
      ]);

      const dadosSalas = await lerResposta(respostaSalas);
      const dadosLaboratorios = await lerResposta(respostaLaboratorios);

      if (!respostaSalas.ok || !respostaLaboratorios.ok) {
        throw new Error("Não foi possível carregar salas e laboratórios.");
      }

      if (!Array.isArray(dadosSalas) || !Array.isArray(dadosLaboratorios)) {
        throw new Error("A API retornou uma lista de recursos inválida.");
      }

      setSalas(dadosSalas);
      setLaboratorios(dadosLaboratorios);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao carregar os recursos disponíveis."
      );
    }
  }

  useEffect(() => {
    verificarPerfil();
    void carregarReservas();
    void carregarRecursos();
  }, []);

  function limparFormulario() {
    setIdEditando(null);
    setIdRecurso("");
    setInicio("");
    setFim("");
  }

  function formatarParaInput(data: string) {
    const convertida = new Date(data);

    if (Number.isNaN(convertida.getTime())) {
      return "";
    }

    const ano = convertida.getFullYear();
    const mes = String(convertida.getMonth() + 1).padStart(2, "0");
    const dia = String(convertida.getDate()).padStart(2, "0");
    const hora = String(convertida.getHours()).padStart(2, "0");
    const minuto = String(convertida.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }

  async function cadastrarReserva(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    if (!ehProfessor) {
      setErro("Somente professores podem cadastrar ou editar reservas.");
      return;
    }

    if (!idRecurso || !inicio || !fim) {
      setErro("Preencha todos os campos da reserva.");
      return;
    }

    if (
      Number.isNaN(new Date(inicio).getTime()) ||
      Number.isNaN(new Date(fim).getTime()) ||
      new Date(fim).getTime() <= new Date(inicio).getTime()
    ) {
      setErro("Informe datas válidas e um término posterior ao início.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      setErro("Faça login para cadastrar uma reserva.");
      return;
    }

    const novaReserva = {
      idSala: tipoRecurso === "sala" ? Number(idRecurso) : null,
      idLaboratorio:
        tipoRecurso === "laboratorio" ? Number(idRecurso) : null,
      inicio,
      fim,
    };

    setEnviando(true);

    try {
      const editando = idEditando !== null;

      const resposta = await fetch(
        editando
          ? `http://localhost:8080/reservas/${idEditando}`
          : "http://localhost:8080/reservas",
        {
          method: editando ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novaReserva),
        }
      );

      const resultado: ResultadoAPI = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          resultado.message ||
            (editando
              ? "Não foi possível atualizar a reserva."
              : "Não foi possível cadastrar a reserva.")
        );
      }

      setMensagem(
        resultado.message ||
          (editando
            ? "Reserva atualizada com sucesso!"
            : "Reserva cadastrada com sucesso!")
      );

      limparFormulario();
      await carregarReservas();
    } catch (erro) {
      setErro(
        erro instanceof Error ? erro.message : "Erro ao salvar a reserva."
      );
    } finally {
      setEnviando(false);
    }
  }

  function editarReserva(reserva: Reserva) {
    setErro("");
    setMensagem("");
    setIdEditando(reserva.id);

    if (reserva.idSala !== null) {
      setTipoRecurso("sala");
      setIdRecurso(String(reserva.idSala));
    } else {
      setTipoRecurso("laboratorio");
      setIdRecurso(String(reserva.idLaboratorio ?? ""));
    }

    setInicio(formatarParaInput(reserva.inicio));
    setFim(formatarParaInput(reserva.fim));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirReserva(id: number) {
    if (!ehProfessor) {
      setErro("Somente professores podem excluir reservas.");
      return;
    }

    if (!window.confirm(`Deseja realmente excluir a reserva #${id}?`)) {
      return;
    }

    setErro("");
    setMensagem("");

    const token = sessionStorage.getItem("token");

    if (!token) {
      setErro("Faça login para excluir uma reserva.");
      return;
    }

    setExcluindo(id);

    try {
      const resposta = await fetch(
        `http://localhost:8080/reservas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado: ResultadoAPI = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          resultado.message || "Não foi possível excluir a reserva."
        );
      }

      setMensagem(resultado.message || "Reserva excluída com sucesso!");

      if (idEditando === id) {
        limparFormulario();
      }

      await carregarReservas();
    } catch (erro) {
      setErro(
        erro instanceof Error ? erro.message : "Erro ao excluir a reserva."
      );
    } finally {
      setExcluindo(null);
    }
  }

  function formatarDataHora(data: string) {
    const convertida = new Date(data);

    if (Number.isNaN(convertida.getTime())) {
      return "Data inválida";
    }

    return convertida.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  const recursos = tipoRecurso === "sala" ? salas : laboratorios;

  return (
    <main className={styles.container}>
      <header className={styles.cabecalho}>
        <div className={styles.iconeCabecalho} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <path d="m9 15 2 2 4-4" />
          </svg>
        </div>

        <div>
          <p className={styles.subtitulo}>GERENCIAMENTO DE ESPAÇOS</p>
          <h1 className={styles.titulo}>Reservas</h1>
          <p className={styles.descricaoCabecalho}>
            Cadastre e consulte as reservas de salas e laboratórios.
          </p>
        </div>
      </header>

      {ehProfessor && (
        <section className={styles.painel}>
          <div className={styles.tituloSecao}>
            <div className={styles.iconeSecao} aria-hidden="true">
              {idEditando !== null ? "✎" : "+"}
            </div>

            <div>
              <h2>
                {idEditando !== null
                  ? `Editar reserva #${idEditando}`
                  : "Cadastrar reserva"}
              </h2>
              <p>
                {idEditando !== null
                  ? "Altere os dados e salve as modificações."
                  : "Preencha os dados para solicitar uma reserva."}
              </p>
            </div>
          </div>

          <form className={styles.formulario} onSubmit={cadastrarReserva}>
            <div className={styles.gradeFormulario}>
              <div className={styles.campo}>
                <label htmlFor="tipoRecurso">Tipo de recurso</label>
                <select
                  id="tipoRecurso"
                  value={tipoRecurso}
                  onChange={(evento) => {
                    setTipoRecurso(evento.target.value);
                    setIdRecurso("");
                  }}
                >
                  <option value="sala">Sala</option>
                  <option value="laboratorio">Laboratório</option>
                </select>
              </div>

              <div className={styles.campo}>
                <label htmlFor="recurso">Sala ou laboratório</label>
                <select
                  id="recurso"
                  value={idRecurso}
                  onChange={(evento) => setIdRecurso(evento.target.value)}
                  required
                >
                  <option value="">Selecione um recurso</option>
                  {recursos.map((recurso) => (
                    <option key={recurso.id} value={recurso.id}>
                      {recurso.codigo} - {recurso.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.campo}>
                <label htmlFor="inicio">Data e horário de início</label>
                <input
                  id="inicio"
                  type="datetime-local"
                  value={inicio}
                  onChange={(evento) => setInicio(evento.target.value)}
                  required
                />
              </div>

              <div className={styles.campo}>
                <label htmlFor="fim">Data e horário de término</label>
                <input
                  id="fim"
                  type="datetime-local"
                  value={fim}
                  onChange={(evento) => setFim(evento.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.avisoHorario}>
              Confira a disponibilidade do recurso. As regras de horário e
              conflito também devem ser validadas pelo servidor.
            </div>

            {mensagem && (
              <div className={styles.mensagemSucesso} role="status">
                {mensagem}
              </div>
            )}

            {erro && (
              <div className={styles.mensagemErro} role="alert">
                {erro}
              </div>
            )}

            <div className={styles.acoesFormulario}>
              <button
                className={styles.botaoPrincipal}
                type="submit"
                disabled={enviando}
              >
                {enviando
                  ? "Salvando..."
                  : idEditando !== null
                    ? "Salvar alterações"
                    : "Cadastrar reserva"}
              </button>

              {idEditando !== null && (
                <button
                  className={styles.botaoSecundario}
                  type="button"
                  onClick={limparFormulario}
                  disabled={enviando}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <section className={styles.secaoReservas}>
        <div className={styles.cabecalhoReservas}>
          <div>
            <h2>Reservas cadastradas</h2>
            <p>Consulte os horários e os recursos reservados.</p>
          </div>

          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => void carregarReservas()}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {erro && (
          <div className={styles.mensagemErro} role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className={styles.mensagemSucesso} role="status">
            {mensagem}
          </div>
        )}

        {carregando ? (
          <div className={styles.estadoVazio}>Carregando reservas...</div>
        ) : dados.length === 0 ? (
          <div className={styles.estadoVazio}>
            <h3>Nenhuma reserva encontrada</h3>
            <p>Não há reservas para exibir no momento.</p>
          </div>
        ) : (
          <div className={styles.listaReservas}>
            {dados.map((reserva) => {
              const recurso =
                reserva.idSala !== null
                  ? `Sala: ${reserva.nomeSala ?? reserva.codigoSala ?? reserva.idSala}`
                  : `Laboratório: ${
                      reserva.nomeLaboratorio ??
                      reserva.codigoLaboratorio ??
                      reserva.idLaboratorio ??
                      "Não informado"
                    }`;

              return (
                <article
                  className={styles.cartaoReserva}
                  key={reserva.id}
                >
                  <div className={styles.linhaCartao}>
                    <div className={styles.iconeRecurso} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5" />
                      </svg>
                    </div>

                    <div className={styles.informacaoRecurso}>
                      <h3>{recurso}</h3>
                      <p>Reserva #{reserva.id}</p>
                    </div>

                    <span className={styles.status}>
                      {reserva.statusReserva || "Sem status"}
                    </span>
                  </div>

                  <div className={styles.detalhesReserva}>
                    <div className={styles.detalhe}>
                      <span className={styles.rotuloDetalhe}>Início</span>
                      <span>{formatarDataHora(reserva.inicio)}</span>
                    </div>

                    <div className={styles.detalhe}>
                      <span className={styles.rotuloDetalhe}>Término</span>
                      <span>{formatarDataHora(reserva.fim)}</span>
                    </div>

                    <div className={styles.detalhe}>
                      <span className={styles.rotuloDetalhe}>Responsável</span>
                      <span>
                        {reserva.nomeUsuario || `Usuário #${reserva.idUsuario}`}
                      </span>
                    </div>
                  </div>

                  {ehProfessor && (
                    <div className={styles.acoesReserva}>
                      <button
                        type="button"
                        className={styles.botaoEditar}
                        onClick={() => editarReserva(reserva)}
                        disabled={enviando || excluindo !== null}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className={styles.botaoExcluir}
                        onClick={() => void excluirReserva(reserva.id)}
                        disabled={enviando || excluindo !== null}
                      >
                        {excluindo === reserva.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  )}

                  <footer className={styles.rodapeCartao}>
                    <span>Reserva #{reserva.id}</span>
                    <span>Consulte a disponibilidade antes de reservar novamente.</span>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}