import Categoria from '../models/Categoria.js';
class CategoriaController {
  static async listarCategorias(req, res) {
    try { const result = await Categoria.buscarTodas(); res.status(200).json(result.recordset); }
    catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
  static async cadastrarCategoria(req, res) {
    try {
      const nome = req.body?.nome;
      if (typeof nome !== 'string' || !nome.trim() || nome.length > 50)
        return res.status(400).json({ erro: 'Nome da categoria obrigatório (até 50 caracteres)' });
      const result = await Categoria.cadastrar(nome.trim());
      res.status(201).json({ mensagem: 'Categoria cadastrada', id: result.recordset[0].id });
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  }
}
export default CategoriaController;
