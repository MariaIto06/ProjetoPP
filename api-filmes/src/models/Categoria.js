import sql from 'mssql';
import conectaBD from '../config/dbConnect.js';
class Categoria {
  static async buscarTodas() {
    const conexao = await conectaBD();
    return await conexao.request().query('SELECT id, nome FROM dbFilmes.Categorias ORDER BY nome');
  }
  static async cadastrar(nome) {
    const conexao = await conectaBD();
    return await conexao.request().input('nome', sql.VarChar(50), nome).query('INSERT INTO dbFilmes.Categorias (nome) OUTPUT INSERTED.id VALUES (@nome)');
  }
}
export default Categoria;
