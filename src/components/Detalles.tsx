"use client";

import Image from "next/image";
import { useRevelar } from "./useRevelar";
import styles from "./Detalles.module.scss";

type Momento = {
  hora: string;
  nombre: string;
  icono: string;
  width: number;
  height: number;
  /** Ajuste óptico opcional respecto a la altura común de la caja. */
  escala?: number;
};

const MOMENTOS: Momento[] = [
  {
    hora: "12:30h",
    nombre: "Ceremonia",
    icono: "/assets/svg/icono-anillos.svg",
    width: 193,
    height: 96,
    // Es el icono más apaisado: al igualar alturas resulta demasiado ancho
    // frente al resto, así que se compensa ópticamente.
    escala: 0.64,
  },
  {
    hora: "14:00h",
    nombre: "Cocktail",
    icono: "/assets/svg/icono-copas.svg",
    width: 220,
    height: 154,
  },
  {
    hora: "15:30h",
    nombre: "Comida",
    icono: "/assets/svg/icono-comida.svg",
    width: 221,
    height: 151,
  },
  {
    hora: "18:00h",
    nombre: "¡A bailar!",
    icono: "/assets/svg/icono-baile.svg",
    width: 155,
    height: 195,
  },
];

export default function Detalles() {
  const titular = useRevelar<HTMLHeadingElement>();
  const rejilla = useRevelar<HTMLUListElement>();

  return (
    <section className={styles.seccion} aria-labelledby="detalles-title">
      <div className={styles.inner}>
        <h2
          ref={titular.ref}
          id="detalles-title"
          className={`${styles.title} ${titular.visible ? styles.visible : ""}`}
        >
          Detalles de la celebración
        </h2>

        <ul
          ref={rejilla.ref}
          className={`${styles.lista} ${rejilla.visible ? styles.visible : ""}`}
        >
          {MOMENTOS.map(({ hora, nombre, icono, width, height, escala }) => (
            <li key={nombre} className={styles.item}>
              <div className={styles.iconoCaja}>
                <Image
                  src={icono}
                  alt=""
                  aria-hidden="true"
                  width={width}
                  height={height}
                  className={styles.icono}
                  style={
                    escala
                      ? { scale: String(escala), transformOrigin: "center bottom" }
                      : undefined
                  }
                />
              </div>
              <p className={styles.pie}>
                {hora} {nombre}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
