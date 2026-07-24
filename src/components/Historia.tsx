"use client";

import Image from "next/image";
import { useRevelar } from "./useRevelar";
import TextoEscrito, { contarPalabras } from "./TextoEscrito";
import styles from "./Historia.module.scss";

const TEXTOS: { texto: string; clase?: "lead" | "espaciado" }[] = [
  { texto: "Nos tomamos nuestro tiempo… para todo 🤍", clase: "lead" },
  {
    texto:
      "Dicen que las grandes historias empiezan con un flechazo. La nuestra necesitó unos meses para ponerse de acuerdo.",
  },
  {
    texto:
      "Nos conocimos en noviembre de 2010 y, desde abril de 2011, no hemos dejado de escribir esta historia juntos.",
  },
  {
    texto:
      "Entre viajes, deporte, paseos con nuestros perritos, libros, muchas risas y personas que hacen nuestra vida mejor, hemos aprendido que los mejores recuerdos nacen de los pequeños momentos.",
    clase: "espaciado",
  },
  {
    texto:
      "Y ahora comienza un nuevo capítulo, y no se nos ocurre mejor manera de empezarlo que celebrándolo con todos vosotros.",
    clase: "espaciado",
  },
];

/** El retardo se acumula entre párrafos para que la cascada no se reinicie. */
const PARRAFOS = TEXTOS.reduce<
  { texto: string; clase?: "lead" | "espaciado"; desde: number }[]
>((acc, item) => {
  const previo = acc.at(-1);
  const desde = previo ? previo.desde + contarPalabras(previo.texto) : 0;
  return [...acc, { ...item, desde }];
}, []);

/**
 * Cada bloque se posiciona de forma independiente sobre el lienzo, de modo
 * que perro, titular, texto y foto puedan moverse por separado.
 */
export default function Historia() {
  // Cada bloque se observa por separado: la sección ocupa más que la
  // pantalla, así que un único observador dispararía el texto y la foto
  // cuando todavía están por debajo del borde inferior.
  const cabecera = useRevelar<HTMLDivElement>();
  const cuerpo = useRevelar<HTMLDivElement>();
  const foto = useRevelar<HTMLDivElement>();

  return (
    <section className={styles.historia} aria-labelledby="historia-title">
      <div className={styles.stage}>
        <div
          ref={cabecera.ref}
          className={`${styles.perro} ${cabecera.visible ? styles.visible : ""}`}
        >
          <Image
            src="/assets/svg/perro-sentado.svg"
            alt=""
            aria-hidden="true"
            width={257}
            height={274}
            className={styles.perroImg}
          />
        </div>

        <h2
          id="historia-title"
          className={`${styles.title} ${cabecera.visible ? styles.visible : ""}`}
        >
          Nuestra historia
        </h2>

        <div
          ref={cuerpo.ref}
          className={styles.texto}
          data-revelado={cuerpo.visible}
        >
          {PARRAFOS.map(({ texto, clase, desde }) => (
            <TextoEscrito
              key={desde}
              desde={desde}
              className={clase ? styles[clase] : undefined}
            >
              {texto}
            </TextoEscrito>
          ))}
        </div>

        <div
          ref={foto.ref}
          className={`${styles.marco} ${foto.visible ? styles.visible : ""}`}
        >
          <Image
            src="/assets/img/pareja.webp"
            alt="Paloma y José Ramón frente a la muralla de Ávila"
            width={800}
            height={1000}
            className={styles.foto}
          />
        </div>
      </div>
    </section>
  );
}
