// Importa um recurso necessário de outro arquivo ou biblioteca.
import Filme from '../models/Filme.js';
// Devolve o resultado desta função.
function idValido(id) { return Number.isInteger(Number(id)) && Number(id) > 0; }
// Declara uma função que organiza uma tarefa do programa.
function dadosValidos(d) {
  // Devolve o resultado desta função.
  return typeof d?.titulo === 'string' && d.titulo.trim() && d.titulo.length <= 150 &&
    // Executa esta etapa da lógica do programa.
    typeof d?.diretor === 'string' && d.diretor.trim() && d.diretor.length <= 100 &&
    // Executa esta etapa da lógica do programa.
    idValido(d.categoria_id) &&
    // Executa esta etapa da lógica do programa.
    (d.ano_lancamento == null || (Number.isInteger(Number(d.ano_lancamento)) && Number(d.ano_lancamento) > 0)) &&
    // Executa esta etapa da lógica do programa.
    (d.duracao_minutos == null || (Number.isInteger(Number(d.duracao_minutos)) && Number(d.duracao_minutos) > 0));
// Fecha o bloco ou a instrução anterior.
}
// Declara uma função que organiza uma tarefa do programa.
function preparar(d) {
  // Devolve o resultado desta função.
  return { titulo: d.titulo.trim(), diretor: d.diretor.trim(), categoria_id: Number(d.categoria_id),
    // Executa esta etapa da lógica do programa.
    ano_lancamento: d.ano_lancamento == null || d.ano_lancamento === '' ? null : Number(d.ano_lancamento),
    // Executa esta etapa da lógica do programa.
    duracao_minutos: d.duracao_minutos == null || d.duracao_minutos === '' ? null : Number(d.duracao_minutos) };
// Fecha o bloco ou a instrução anterior.
}
// Define uma classe que organiza funções relacionadas.
class FilmeController {
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async listarFilmes(req, res) {
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    try { const result = await Filme.buscarTodos(); res.status(200).json(result.recordset); }
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async buscarFilme(req, res) {
    // Inicia um bloco que pode gerar erros.
    try {
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
      // Espera a operação assíncrona terminar antes de continuar.
      const result = await Filme.buscarPorId(Number(req.params.id));
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!result.recordset.length) return res.status(404).json({ erro: 'Filme não encontrado' });
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      res.status(200).json(result.recordset[0]);
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async cadastrarFilme(req, res) {
    // Inicia um bloco que pode gerar erros.
    try {
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!dadosValidos(req.body)) return res.status(400).json({ erro: 'Informe título, diretor e categoria válidos' });
      // Espera a operação assíncrona terminar antes de continuar.
      const result = await Filme.cadastrar(preparar(req.body));
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      res.status(201).json({ mensagem: 'Filme cadastrado', id: result.recordset[0].id });
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async atualizarFilme(req, res) {
    // Inicia um bloco que pode gerar erros.
    try {
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!idValido(req.params.id) || !dadosValidos(req.body)) return res.status(400).json({ erro: 'ID ou dados inválidos' });
      // Espera a operação assíncrona terminar antes de continuar.
      const result = await Filme.atualizar(Number(req.params.id), preparar(req.body));
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!result.rowsAffected[0]) return res.status(404).json({ erro: 'Filme não encontrado' });
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      res.status(200).json({ mensagem: 'Filme atualizado' });
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async excluirFilme(req, res) {
    // Inicia um bloco que pode gerar erros.
    try {
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
      // Espera a operação assíncrona terminar antes de continuar.
      const result = await Filme.excluir(Number(req.params.id));
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      if (!result.rowsAffected[0]) return res.status(404).json({ erro: 'Filme não encontrado' });
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      res.status(200).json({ mensagem: 'Filme excluído' });
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
// Fecha o bloco ou a instrução anterior.
}
// Disponibiliza este recurso para outros arquivos importarem.
export default FilmeController;
