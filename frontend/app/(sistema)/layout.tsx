"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../componente/header";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.replace("/");
    } else {
      setVerificando(false);
    }
  }, [router]);

  if (verificando) {
    return <p>Verificando acesso...</p>;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}