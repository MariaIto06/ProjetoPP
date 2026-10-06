"use client";

import{FormEvent, useState, useEffect} from "react";

interface status{
  id: number;
  status: string;

}
export default function Status() {
  const[dados, setDados] = useState<status[]>([]);

  async function carregarStatus(){
    const resposta = await fetch("http://localhost:8080/status");
    const dadosRecebidos = await resposta.json();

    setDados(dadosRecebidos);
  }

  useEffect(() => {
    carregarStatus();
  },[]);
  
  return (
    <main>
      <h1>Cadastro de Status</h1>
      <p>Aguardando confirmação dos campos desta funcionalidade.</p>
    </main>
  );
}