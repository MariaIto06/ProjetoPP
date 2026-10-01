import Image from "next/image";

export default function Home() {
  return (
      <main>
      <h1>Sistema de Reserva de Laboratórios e Salas</h1>
      <p>Cadastros da primeira entrega parcial</p>

      <nav>
        <ul>
          <li><Link href="/usuarios">Usuários</Link></li>
          <li><Link href="/laboratorios">Laboratórios</Link></li>
          <li><Link href="/salas">Salas</Link></li>
          <li><Link href="/status">Status</Link></li>
        </ul>
      </nav> 
    </main>
  );



  );
}
