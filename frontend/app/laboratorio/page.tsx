export default function Laboratorios() {
  return (
    <main>
      <h1>Cadastro de Laboratórios</h1>

      <form>
        <label>Código</label>
        <input type="text" name="codigo" />

        <label>Nome</label>
        <input type="text" name="nome" />

        <label>Capacidade</label>
        <input type="number" name="capacidade" />

        <label>Localização</label>
        <input type="text" name="localizacao" />

        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}