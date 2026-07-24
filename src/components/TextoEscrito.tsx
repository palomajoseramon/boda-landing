"use client";

import styles from "./TextoEscrito.module.scss";

type Props = {
  children: string;
  /** Índice de la palabra por la que empieza el escalonado acumulado. */
  desde?: number;
  className?: string;
};

/** Milisegundos entre palabras consecutivas. Con ~120 palabras en total,
 *  un paso mayor haría esperar demasiado a las últimas líneas. */
const PASO = 18;

/**
 * Revela un párrafo palabra a palabra, en cascada rápida. Da la impresión
 * de un texto que se va escribiendo sin la impaciencia del efecto máquina
 * de escribir letra a letra, que en párrafos largos resulta lento de leer.
 *
 * El texto real permanece íntegro para lectores de pantalla y buscadores:
 * las palabras son <span> dentro del mismo párrafo.
 */
export default function TextoEscrito({
  children,
  desde = 0,
  className = "",
}: Props) {
  const palabras = children.split(" ");

  return (
    <p className={`${styles.parrafo} ${className}`}>
      {palabras.map((palabra, i) => (
        <span
          key={`${palabra}-${i}`}
          className={styles.palabra}
          style={{ transitionDelay: `${(desde + i) * PASO}ms` }}
        >
          {palabra}
          {i < palabras.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/** Nº de palabras de un texto, para encadenar el retardo entre párrafos. */
export function contarPalabras(texto: string) {
  return texto.split(" ").length;
}
