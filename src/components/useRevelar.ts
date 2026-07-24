"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marca un contenedor como visible la primera vez que entra en el viewport.
 * Devuelve la ref a colocar en el contenedor y el estado de visibilidad,
 * pensado para alternar una clase que dispare las transiciones de los hijos.
 *
 * Se revela una sola vez: volver a subir no reinicia la animación.
 */
export function useRevelar<T extends HTMLElement = HTMLElement>(
  opciones: { margen?: string; umbral?: number } = {},
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

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
        // El borde inferior de detección se sube un 25% del viewport: así el
        // elemento ya está bien dentro de la pantalla cuando arranca, y no
        // termina de animarse antes de que el usuario llegue a verlo.
        rootMargin: opciones.margen ?? "0px 0px -25% 0px",
        threshold: opciones.umbral ?? 0.15,
      },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return { ref, visible };
}
