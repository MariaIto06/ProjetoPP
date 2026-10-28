
"use client";

import { useEffect, useState } from "react";
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

export default function Status() {
  const [dados, setDados] = useState<Reserva[]>([]);
  const [salas, setSalas] = useState<Recurso[]>([]);
  const [laboratorios, setLaboratorios] = useState<Recurso[]>([]);

  const [tipoRecurso, setTipoRecurso] = useState("sala");
  const [idRecurso, setIdRecurso] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [ehProfessor, setEhProfessor] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  function verificarPerfil() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setEhProfessor(false);
      return;
    }

    try {
      const partes = token.split(".");
      const dadosToken = JSON.parse(atob(partes[1]));

      if (dadosToken.tipoUsuario === "professor") {
        setEhProfessor(true);
      } else {
        setEhProfessor(false);
      }
    } catch {
      setEhProfessor(false);
    }
  }

  async function carregarReservas() {
    setCarregando(true);

    try {
      const token = sessionStorage.getItem("token");

      const resposta = await fetch("http://localhost:8080/reservas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!resposta.ok) {
        alert("Erro ao carregar as reservas.");
        return;
      }

      const resultado = await resposta.json();
      setDados(resultado);
    } catch {
      alert("Não foi possível carregar as reservas.");
    } finally {
      setCarregando(false);
    }
  }

  async function carregarRecursos() {
    try {
      const respostaSalas = await fetch("http://localhost:8080/salas");
      const respostaLaboratorios = await fetch(
        "http://localhost:8080/laboratorios"
      );

      const dadosSalas = await respostaSalas.json();
      const dadosLaboratorios = await respostaLaboratorios.json();

      setSalas(dadosSalas);
      setLaboratorios(dadosLaboratorios);
    } catch {
      alert("Erro ao carregar salas e laboratórios.");
    }
  }

  useEffect(() => {
    verificarPerfil();
    carregarReservas();
    carregarRecursos();
  }, []);

  function limparFormulario() {
    setIdEditando(null);
    setIdRecurso("");
    setInicio("");
    setFim("");
  }

  function formatarParaInput(data: string) {
    const convertida = new Date(data);

    const ano = convertida.getFullYear();
    const mes = String(convertida.getMonth() + 1).padStart(2, "0");
    const dia = String(convertida.getDate()).padStart(2, "0");
    const hora = String(convertida.getHours()).padStart(2, "0");
    const minuto = String(convertida.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }

  async function cadastrarReserva(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!ehProfessor) {
      alert("Somente professores podem cadastrar ou editar reservas.");
      return;
    }

    if (!idRecurso || !inicio || !fim) {
      alert("Preencha todos os campos.");
      return;
    }

    if (new Date(fim).getTime() <= new Date(inicio).getTime()) {
      alert("O término deve ser posterior ao início.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Faça login novamente.");
      return;
    }

    const novaReserva = {
      idSala: tipoRecurso === "sala" ? Number(idRecurso) : null,
      idLaboratorio:
        tipoRecurso === "laboratorio" ? Number(idRecurso) : null,
      inicio,
      fim
    };

    setEnviando(true);

    try {
      let resposta;

      if (idEditando === null) {
        resposta = await fetch("http://localhost:8080/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(novaReserva)
        });
      } else {
        resposta = await fetch(
          `http://localhost:8080/reservas/${idEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(novaReserva)
          }
        );
      }

      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        alert(
          resultado?.message ||
          resultado?.erro ||
          `Não foi possível salvar a reserva. Código: ${resposta.status}`
        );
        return;
      }

      alert("Reserva salva com sucesso!");

      limparFormulario();
      await carregarReservas();
    } catch {
      alert("Erro ao salvar a reserva. Verifique a conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  function editarReserva(reserva: Reserva) {
    setIdEditando(reserva.id);

    if (reserva.idSala !== null) {
      setTipoRecurso("sala");
      setIdRecurso(String(reserva.idSala));
    } else {
      setTipoRecurso("laboratorio");
      setIdRecurso(String(reserva.idLaboratorio));
    }

    setInicio(formatarParaInput(reserva.inicio));
    setFim(formatarParaInput(reserva.fim));

    window.scrollTo(0, 0);
  }

  async function excluirReserva(id: number) {
    if (!ehProfessor) {
      alert("Somente professores podem excluir reservas.");
      return;
    }

    if (!window.confirm("Deseja realmente excluir esta reserva?")) {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Faça login novamente.");
      return;
    }

    setExcluindo(true);

    try {
      const resposta = await fetch(
        `http://localhost:8080/reservas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        alert(
          resultado?.message ||
          resultado?.erro ||
          `Não foi possível excluir a reserva. Código: ${resposta.status}`
        );
        return;
      }

      alert("Reserva excluída com sucesso!");

      if (idEditando === id) {
        limparFormulario();
      }

      await carregarReservas();
    } catch {
      alert("Erro ao excluir a reserva.");
    } finally {
      setExcluindo(false);
    }
  }

  function formatarDataHora(data: string) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  const recursos = tipoRecurso === "sala" ? salas : laboratorios;

  return (
    <main className={styles.container}>
      <header className={styles.cabecalho}>
        <div className={styles.iconeCabecalho}>📅</div>

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
            <div className={styles.iconeSecao}>
              {idEditando !== null ? "✎" : "+"}
            </div>

            <div>
              <h2>
                {idEditando !== null
                  ? "Editar reserva"
                  : "Cadastrar reserva"}
              </h2>
              <p>Preencha os dados da reserva.</p>
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
              Confira a disponibilidade antes de reservar.
            </div>

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
            onClick={carregarReservas}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {carregando ? (
          <div className={styles.estadoVazio}>Carregando reservas...</div>
        ) : dados.length === 0 ? (
          <div className={styles.estadoVazio}>
            <h3>Nenhuma reserva encontrada</h3>
            <p>Não há reservas para exibir no momento.</p>
          </div>
        ) : (
          <div className={styles.listaReservas}>
            {dados.map((reserva) => (
              <article
                className={styles.cartaoReserva}
                key={reserva.id}
              >
                <div className={styles.linhaCartao}>
                  <div className={styles.iconeRecurso}>🏢</div>

                  <div className={styles.informacaoRecurso}>
                    <h3>
                      {reserva.idSala !== null
                        ? "Sala: " + (reserva.nomeSala || reserva.codigoSala)
                        : "Laboratório: " +
                          (reserva.nomeLaboratorio ||
                            reserva.codigoLaboratorio)}
                    </h3>
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
                    <span>{reserva.nomeUsuario}</span>
                  </div>
                </div>

                {ehProfessor && (
                  <div className={styles.acoesReserva}>
                    <button
                      type="button"
                      className={styles.botaoEditar}
                      onClick={() => editarReserva(reserva)}
                      disabled={enviando || excluindo}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={styles.botaoExcluir}
                      onClick={() => excluirReserva(reserva.id)}
                      disabled={enviando || excluindo}
                    >
                      {excluindo ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                )}

                <footer className={styles.rodapeCartao}>
                  <span>Reserva #{reserva.id}</span>
                  <span>Consulte a disponibilidade antes de reservar.</span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
