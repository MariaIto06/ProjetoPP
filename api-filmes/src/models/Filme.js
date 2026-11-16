// Importa um recurso necessário de outro arquivo ou biblioteca.
import sql from 'mssql';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import conectaBD from '../config/dbConnect.js';

// Define uma classe que organiza funções relacionadas.
class Filme {
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async buscarTodos() {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request().query(
      // Continua a operação iniciada na linha anterior.
      'SELECT f.id, f.titulo, f.categoria_id, c.nome AS categoria, f.diretor, f.ano_lancamento, f.duracao_minutos FROM dbFilmes.Filmes f INNER JOIN dbFilmes.Categorias c ON f.categoria_id = c.id ORDER BY f.id'
    // Executa esta etapa da lógica do programa.
    );
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async buscarPorId(id) {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request().input('id', sql.Int, id).query(
      // Continua a operação iniciada na linha anterior.
      'SELECT f.id, f.titulo, f.categoria_id, c.nome AS categoria, f.diretor, f.ano_lancamento, f.duracao_minutos FROM dbFilmes.Filmes f INNER JOIN dbFilmes.Categorias c ON f.categoria_id = c.id WHERE f.id = @id'
    // Executa esta etapa da lógica do programa.
    );
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async cadastrar(dados) {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request()
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('titulo', sql.VarChar(150), dados.titulo)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('categoria_id', sql.Int, dados.categoria_id)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('diretor', sql.VarChar(100), dados.diretor)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('ano_lancamento', sql.Int, dados.ano_lancamento ?? null)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('duracao_minutos', sql.Int, dados.duracao_minutos ?? null)
      // Executa uma consulta SQL no banco de dados.
      .query('INSERT INTO dbFilmes.Filmes (titulo, categoria_id, diretor, ano_lancamento, duracao_minutos) OUTPUT INSERTED.id VALUES (@titulo, @categoria_id, @diretor, @ano_lancamento, @duracao_minutos)');
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async atualizar(id, dados) {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request()
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('id', sql.Int, id)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('titulo', sql.VarChar(150), dados.titulo)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('categoria_id', sql.Int, dados.categoria_id)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('diretor', sql.VarChar(100), dados.diretor)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('ano_lancamento', sql.Int, dados.ano_lancamento ?? null)
      // Envia um parâmetro nomeado e tipado ao SQL Server, evitando concatenar valores na consulta.
      .input('duracao_minutos', sql.Int, dados.duracao_minutos ?? null)
      // Executa uma consulta SQL no banco de dados.
      .query('UPDATE dbFilmes.Filmes SET titulo=@titulo, categoria_id=@categoria_id, diretor=@diretor, ano_lancamento=@ano_lancamento, duracao_minutos=@duracao_minutos WHERE id=@id');
  // Fecha o bloco ou a instrução anterior.
  }
  // Define um método assíncrono que pode ser chamado diretamente pela classe.
  static async excluir(id) {
    // Espera a operação assíncrona terminar antes de continuar.
    const conexao = await conectaBD();
    // Espera a operação assíncrona terminar antes de continuar.
    return await conexao.request().input('id', sql.Int, id).query('DELETE FROM dbFilmes.Filmes WHERE id=@id');
  // Fecha o bloco ou a instrução anterior.
  }
// Fecha o bloco ou a instrução anterior.
}
// Disponibiliza este recurso para outros arquivos importarem.
export default Filme;
