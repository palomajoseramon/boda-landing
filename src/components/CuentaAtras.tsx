"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRevelar } from "./useRevelar";
import styles from "./CuentaAtras.module.scss";

/** 23 de enero de 2027, 12:00 (hora peninsular, UTC+1 en enero). */
const FECHA_BODA = new Date("2027-01-23T12:00:00+01:00").getTime();

type Restante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

function calcular(): Restante {
  const diff = FECHA_BODA - Date.now();

  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  const segundosTotales = Math.floor(diff / 1000);

  return {
    dias: Math.floor(segundosTotales / 86400),
    horas: Math.floor((segundosTotales % 86400) / 3600),
    minutos: Math.floor((segundosTotales % 3600) / 60),
    segundos: segundosTotales % 60,
  };
}

export default function CuentaAtras() {
  // Arranca en null para que servidor y cliente rendericen lo mismo: el
  // cálculo real depende de la hora del navegador y solo puede ocurrir
  // tras el montaje.
  const [restante, setRestante] = useState<Restante | null>(null);

  useEffect(() => {
    setRestante(calcular());

    const id = setInterval(() => setRestante(calcular()), 1000);
    return () => clearInterval(id);
  }, []);

  const bloques = [
    { valor: restante?.dias, etiqueta: "Días", digitos: 3 },
    { valor: restante?.horas, etiqueta: "Horas", digitos: 2 },
    { valor: restante?.minutos, etiqueta: "Minutos", digitos: 2 },
    { valor: restante?.segundos, etiqueta: "Segundos", digitos: 2 },
  ];

  const { ref, visible } = useRevelar<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`${styles.seccion} ${visible ? styles.visible : ""}`}
      aria-labelledby="cuenta-title"
    >
      <div className={styles.inner}>
        <h2 id="cuenta-title" className={styles.title}>
          Cuenta atrás
        </h2>

        <div
          className={styles.marcador}
          role="timer"
          aria-live="off"
          aria-label="Tiempo restante hasta la boda"
        >
          {bloques.map(({ valor, etiqueta, digitos }, i) => (
            <div key={etiqueta} className={styles.grupo}>
              {i > 0 && (
                <span className={styles.separador} aria-hidden="true">
                  :
                </span>
              )}

              <div className={styles.bloque}>
                <span className={styles.numero}>
                  {valor === undefined
                    ? "—".repeat(digitos)
                    : String(valor).padStart(digitos, "0")}
                </span>
                <span className={styles.etiqueta}>{etiqueta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.perro}>
          <Image
            src="/assets/svg/perro-de-pie.svg"
            alt=""
            aria-hidden="true"
            width={253}
            height={359}
            className={styles.perroImg}
          />
        </div>
      </div>
    </section>
  );
}
