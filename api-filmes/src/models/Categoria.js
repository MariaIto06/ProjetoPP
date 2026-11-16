// Importa um recurso necessário de outro arquivo ou biblioteca.
import sql from 'mssql';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import conectaBD from '../config/dbConnect.js';
// Define uma classe que organiza funções relacionadas.
class Categoria {
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async buscarTodas() {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request().query('SELECT id, nome FROM dbFilmes.Categorias ORDER BY nome');
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async cadastrar(nome) {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request().input('nome', sql.VarChar(50), nome).query('INSERT INTO dbFilmes.Categorias (nome) OUTPUT INSERTED.id VALUES (@nome)');
  // Fecha o bloco ou a instrução anterior.
  }
// Fecha o bloco ou a instrução anterior.
}
// Disponibiliza este recurso para outros arquivos importarem.
export default Categoria;
