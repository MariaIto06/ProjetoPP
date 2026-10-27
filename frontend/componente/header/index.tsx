"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css";

export function Header() {
    const [tipoUsuario, setTipoUsuario] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) return;

        try {
            const payload = token.split(".")[1];

            const dados = JSON.parse(
                atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
            );

            setTipoUsuario(dados.tipoUsuario);
        } catch (erro) {
            console.error("Erro ao ler o perfil do usuário:", erro);
        }
    }, []);

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.menu}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>

                    <li>
                        <Link href="/laboratorio">Laboratórios</Link>
                    </li>

                    {tipoUsuario === "professor" && (
                        <li>
                            <Link href="/gerenciar-usuarios">Usuários</Link>
                        </li>
                    )}

                    <li>
                        <Link href="/salas">Salas</Link>
                    </li>

                    <li>
                        <Link href="/status">Status</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}