"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Revelar.module.scss";

type Props = {
  children: React.ReactNode;
  /** Retardo en milisegundos, para escalonar elementos hermanos. */
  retardo?: number;
  /** Etiqueta a renderizar. Por defecto un div. */
  as?: "div" | "section" | "li" | "p";
  className?: string;
};

/**
 * Revela su contenido cuando entra en el viewport: opacidad y un
 * desplazamiento corto hacia arriba. Ocurre una sola vez por elemento —
 * volver a subir no reinicia la animación, que resultaría inquietante.
 *
 * Si el usuario prefiere movimiento reducido, el contenido se muestra
 * directamente sin transición (ver Revelar.module.scss).
 */
export default function Revelar({
  children,
  retardo = 0,
  as: Etiqueta = "div",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    // Sin soporte de IntersectionObserver el contenido se muestra sin más.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      {
        // Se dispara un poco antes de que el borde inferior lo alcance,
        // de modo que el elemento ya está en marcha al aparecer.
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.08,
      },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref as React.Ref<never>}
      className={`${styles.revelar} ${visible ? styles.visible : ""} ${className}`}
      style={retardo ? { transitionDelay: `${retardo}ms` } : undefined}
    >
      {children}
    </Etiqueta>
  );
}
