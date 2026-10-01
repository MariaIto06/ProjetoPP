export default function Usuarios() {
  return (
    <main>
      <h1>Cadastro de Usuários</h1>
      <form>
        <label>CPF</label>
        <input type="text" name="cpf" />

        <label>Nome completo</label>
        <input type="text" name="nome" />

        <label>Data de aniversário</label>
        <input type="date" name="dataNascimento" />

        <label>Celular</label>
        <input type="text" name="celular" />

        <label>E-mail</label>
        <input type="email" name="email" />

        <label>Login</label>
        <input type="text" name="login" />

        <label>Senha</label>
        <input type="password" name="senha" />

        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}