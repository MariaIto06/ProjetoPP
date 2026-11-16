import sql from 'mssql';
import conectaBD from '../config/dbConnect.js';

class Filme {
  static async buscarTodos() {
    const conexao = await conectaBD();
    return await conexao.request().query(
      'SELECT f.id, f.titulo, f.categoria_id, c.nome AS categoria, f.diretor, f.ano_lancamento, f.duracao_minutos FROM dbFilmes.Filmes f INNER JOIN dbFilmes.Categorias c ON f.categoria_id = c.id ORDER BY f.id'
    );
  }
  static async buscarPorId(id) {
    const conexao = await conectaBD();
    return await conexao.request().input('id', sql.Int, id).query(
      'SELECT f.id, f.titulo, f.categoria_id, c.nome AS categoria, f.diretor, f.ano_lancamento, f.duracao_minutos FROM dbFilmes.Filmes f INNER JOIN dbFilmes.Categorias c ON f.categoria_id = c.id WHERE f.id = @id'
    );
  }
  static async cadastrar(dados) {
    const conexao = await conectaBD();
    return await conexao.request()
      .input('titulo', sql.VarChar(150), dados.titulo)
      .input('categoria_id', sql.Int, dados.categoria_id)
      .input('diretor', sql.VarChar(100), dados.diretor)
      .input('ano_lancamento', sql.Int, dados.ano_lancamento ?? null)
      .input('duracao_minutos', sql.Int, dados.duracao_minutos ?? null)
      .query('INSERT INTO dbFilmes.Filmes (titulo, categoria_id, diretor, ano_lancamento, duracao_minutos) OUTPUT INSERTED.id VALUES (@titulo, @categoria_id, @diretor, @ano_lancamento, @duracao_minutos)');
  }
  static async atualizar(id, dados) {
    const conexao = await conectaBD();
    return await conexao.request()
      .input('id', sql.Int, id)
      .input('titulo', sql.VarChar(150), dados.titulo)
      .input('categoria_id', sql.Int, dados.categoria_id)
      .input('diretor', sql.VarChar(100), dados.diretor)
      .input('ano_lancamento', sql.Int, dados.ano_lancamento ?? null)
      .input('duracao_minutos', sql.Int, dados.duracao_minutos ?? null)
      .query('UPDATE dbFilmes.Filmes SET titulo=@titulo, categoria_id=@categoria_id, diretor=@diretor, ano_lancamento=@ano_lancamento, duracao_minutos=@duracao_minutos WHERE id=@id');
  }
  static async excluir(id) {
    const conexao = await conectaBD();
    return await conexao.request().input('id', sql.Int, id).query('DELETE FROM dbFilmes.Filmes WHERE id=@id');
  }
}
export default Filme;
