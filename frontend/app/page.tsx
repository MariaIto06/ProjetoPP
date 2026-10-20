"use client";

export default function Login() {

  async function entrar(evento: React.SyntheticEvent<HTMLFormElement>){
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const FormularioDados = new FormData(formulario);

    const usuario = {
      login: FormularioDados.get("login"),
      senha: FormularioDados.get("senha"),
    };

    try{
      const response = await fetch (
        "https://localhost:8080",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );

      const resultado = await response.json();

      if(!response.ok){
        alert(resultado.message ||"Login ou senha invalidos")
        return;
      }

      alert("Login realizado com sucesso");
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      alert("Não foi possível conectar ao servidor.");
    }
  }
  return (
    <main>
      <h1>Entrar no sistema</h1>

      <form>
        <div>
          <label htmlFor="login">Login</label>
          <input
            id="login"
            name="login"
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}