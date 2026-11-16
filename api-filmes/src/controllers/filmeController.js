import Filme from '../models/Filme.js';
function idValido(id) { return Number.isInteger(Number(id)) && Number(id) > 0; }
function dadosValidos(d) {
  return typeof d?.titulo === 'string' && d.titulo.trim() && d.titulo.length <= 150 &&
    typeof d?.diretor === 'string' && d.diretor.trim() && d.diretor.length <= 100 &&
    idValido(d.categoria_id) &&
    (d.ano_lancamento == null || (Number.isInteger(Number(d.ano_lancamento)) && Number(d.ano_lancamento) > 0)) &&
    (d.duracao_minutos == null || (Number.isInteger(Number(d.duracao_minutos)) && Number(d.duracao_minutos) > 0));
}
function preparar(d) {
  return { titulo: d.titulo.trim(), diretor: d.diretor.trim(), categoria_id: Number(d.categoria_id),
    ano_lancamento: d.ano_lancamento == null || d.ano_lancamento === '' ? null : Number(d.ano_lancamento),
    duracao_minutos: d.duracao_minutos == null || d.duracao_minutos === '' ? null : Number(d.duracao_minutos) };
}
class FilmeController {
  static async listarFilmes(req, res) {
    try { const result = await Filme.buscarTodos(); res.status(200).json(result.recordset); }
    catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
  static async buscarFilme(req, res) {
    try {
      if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
      const result = await Filme.buscarPorId(Number(req.params.id));
      if (!result.recordset.length) return res.status(404).json({ erro: 'Filme não encontrado' });
      res.status(200).json(result.recordset[0]);
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
  static async cadastrarFilme(req, res) {
    try {
      if (!dadosValidos(req.body)) return res.status(400).json({ erro: 'Informe título, diretor e categoria válidos' });
      const result = await Filme.cadastrar(preparar(req.body));
      res.status(201).json({ mensagem: 'Filme cadastrado', id: result.recordset[0].id });
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
  static async atualizarFilme(req, res) {
    try {
      if (!idValido(req.params.id) || !dadosValidos(req.body)) return res.status(400).json({ erro: 'ID ou dados inválidos' });
      const result = await Filme.atualizar(Number(req.params.id), preparar(req.body));
      if (!result.rowsAffected[0]) return res.status(404).json({ erro: 'Filme não encontrado' });
      res.status(200).json({ mensagem: 'Filme atualizado' });
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
  static async excluirFilme(req, res) {
    try {
      if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
      const result = await Filme.excluir(Number(req.params.id));
      if (!result.rowsAffected[0]) return res.status(404).json({ erro: 'Filme não encontrado' });
      res.status(200).json({ mensagem: 'Filme excluído' });
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
}
export default FilmeController;
