"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Sobre.module.scss";

const FRAMES = 123;
const FPS = 30;
const FADE_MUSICA_MS = 1600;
/** Duración de la fusión: la tarjeta se acerca y se funde con el hero,
 *  que emerge por debajo durante el mismo intervalo. */
const FUSION_MS = 1700;

/** Ruta de un frame por su índice (0…122). */
const frameSrc = (i: number) =>
  `/assets/sobre/frame${String(i).padStart(3, "0")}.webp`;

type Fase = "cerrado" | "animando" | "fundiendo" | "abierto";

/**
 * Portada con el sobre. Al hacer click arranca la música en bucle (con fade)
 * y se reproduce la secuencia de frames; al terminar, el overlay se funde
 * con el hero que hay debajo.
 */
export default function Sobre() {
  const [fase, setFase] = useState<Fase>("cerrado");
  const [indice, setIndice] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);

  // Progreso de la animación (0→1). Gobierna el encuadre: al inicio el marco
  // es casi cuadrado y muestra la mitad inferior del frame (el sobre,
  // centrado); conforme avanza, el marco se estira en alto y su encuadre sube
  // para dar cabida a la tarjeta que emerge hacia arriba.
  const progreso = indice / (FRAMES - 1);

  // El frame se muestra ENTERO. El sobre está en su mitad inferior, así que se
  // sube el frame un poco (base) para centrar el sobre en pantalla. Durante la
  // salida de la tarjeta se baja transitoriamente (vaivén) para dejarle sitio
  // arriba, y luego vuelve al mismo punto. Valores en píxeles.
  const base = -170; // sube el frame para centrar el sobre

  // Vaivén con ida lenta y vuelta rápida: se baja el frame de forma suave para
  // dejar salir la tarjeta y, cuando la animación va a terminar, se acelera el
  // regreso al centro. La fase de retorno (progreso > 0.5) usa una potencia
  // que la comprime hacia el final.
  const bruto = Math.sin(progreso * Math.PI); // 0 → 1 → 0
  const vaiven =
    progreso <= 0.5
      ? bruto // ida: tal cual (suave)
      : bruto ** 2.2; // vuelta: acelerada hacia el centro
  const offsetY = base + vaiven * 130;

  // Precarga de todos los frames para que la reproducción no se entrecorte
  useEffect(() => {
    FRAMES > 0 &&
      Array.from({ length: FRAMES }, (_, i) => {
        const img = new window.Image();
        img.src = frameSrc(i);
        return img;
      });
  }, []);

  const arrancarMusica = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(() => {
      // Si el navegador la bloquea pese al gesto, seguimos sin música
    });

    // Fade in manual: subir el volumen progresivamente. Se acota a [0, 1]
    // porque el primer timestamp del rAF puede ser anterior a `inicio` y dar
    // un valor negativo, que `volume` rechaza.
    const inicio = performance.now();
    const subir = (t: number) => {
      const p = Math.min(Math.max((t - inicio) / FADE_MUSICA_MS, 0), 1);
      audio.volume = p;
      if (p < 1) requestAnimationFrame(subir);
    };
    requestAnimationFrame(subir);
  }, []);

  const abrir = useCallback(() => {
    if (fase !== "cerrado") return;
    setFase("animando");
    arrancarMusica();

    // Reproduce la secuencia sincronizada por tiempo, no por render, para
    // que vaya a los FPS correctos con independencia de la pantalla.
    const inicio = performance.now();
    const paso = (t: number) => {
      const frame = Math.floor(((t - inicio) / 1000) * FPS);
      if (frame >= FRAMES - 1) {
        setIndice(FRAMES - 1);
        // Fin de la animación: comienza la fusión. La tarjeta se acerca y se
        // desvanece a la vez que el hero emerge por debajo. El atributo en el
        // body permite que el hero arranque su entrada sincronizado.
        setFase("fundiendo");
        document.body.dataset.entrando = "true";
        window.setTimeout(() => setFase("abierto"), FUSION_MS);
        return;
      }
      setIndice(frame);
      rafRef.current = requestAnimationFrame(paso);
    };
    rafRef.current = requestAnimationFrame(paso);
  }, [fase, arrancarMusica]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Bloquea el scroll de la web mientras el sobre no se ha abierto del todo
  useEffect(() => {
    document.body.dataset.locked = fase === "abierto" ? "false" : "true";
  }, [fase]);

  // Marca que el sobre está activo: el hero se mantiene oculto y solo emerge
  // cuando llega data-entrando. Si el sobre no llegara a montarse, el hero se
  // vería con normalidad (el selector no se activa).
  useEffect(() => {
    document.body.dataset.sobre = "activo";
    return () => {
      delete document.body.dataset.sobre;
    };
  }, []);

  return (
    <div
      className={[
        styles.overlay,
        fase === "fundiendo" ? styles.fundiendo : "",
        fase === "abierto" ? styles.oculto : "",
      ]
        .filter(Boolean)
        .join(" ")}
      // Una vez abierto deja pasar los clicks a la web de debajo
      aria-hidden={fase === "abierto"}
    >
      <audio ref={audioRef} src="/assets/audio/married-life.mp3" preload="auto" />

      <button
        type="button"
        className={`${styles.escena} ${fase === "cerrado" ? styles.reposo : ""}`}
        onClick={abrir}
        disabled={fase !== "cerrado"}
        aria-label="Abrir la invitación"
      >
        <div className={styles.marco}>
          <Image
            src={frameSrc(indice)}
            alt=""
            width={900}
            height={1698}
            className={styles.frame}
            style={{ transform: `translateY(${offsetY}px)` }}
            priority
            unoptimized
          />
        </div>

        {fase === "cerrado" && (
          <span className={styles.pista}>Haz click para empezar</span>
        )}
      </button>
    </div>
  );
}
