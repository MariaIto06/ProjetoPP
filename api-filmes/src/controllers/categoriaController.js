// Importa um recurso necessário de outro arquivo ou biblioteca.
import Categoria from '../models/Categoria.js';
// Define uma classe que organiza funções relacionadas.
class CategoriaController {
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async listarCategorias(req, res) {
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    try { const result = await Categoria.buscarTodas(); res.status(200).json(result.recordset); }
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async cadastrarCategoria(req, res) {
    // Inicia um bloco que pode gerar erros.
    try {
      // Cria uma variável para guardar um valor ou referência.
      const nome = req.body?.nome;
      // Verifica uma condição antes de executar a próxima ação.
      if (typeof nome !== 'string' || !nome.trim() || nome.length > 50)
        // Envia a resposta HTTP com o código de status e os dados em JSON.
        return res.status(400).json({ erro: 'Nome da categoria obrigatório (até 50 caracteres)' });
      // Espera a operação assíncrona terminar antes de continuar.
      const result = await Categoria.cadastrar(nome.trim());
      // Envia a resposta HTTP com o código de status e os dados em JSON.
      res.status(201).json({ mensagem: 'Categoria cadastrada', id: result.recordset[0].id });
    // Envia a resposta HTTP com o código de status e os dados em JSON.
    } catch (erro) { res.status(500).json({ erro: erro.message }); }
  // Fecha o bloco ou a instrução anterior.
  }
// Fecha o bloco ou a instrução anterior.
}
// Disponibiliza este recurso para outros arquivos importarem.
export default CategoriaController;
