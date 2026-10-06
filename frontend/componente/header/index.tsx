import Link from "next/link";
import styles from "./header.module.css";

export function Header(){
    return(
        <header className={styles.header}>
            <nav>
                <ul className={styles.menu}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/laboratorio">Laboratorios</Link>
                    </li>
                    <li>
                        <Link href="/usuarios">Usuarios</Link>
                    </li>
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