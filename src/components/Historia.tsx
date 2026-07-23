import Image from "next/image";
import styles from "./Historia.module.scss";

/**
 * Cada bloque se posiciona de forma independiente sobre el lienzo, de modo
 * que perro, titular, texto y foto puedan moverse por separado.
 */
export default function Historia() {
  return (
    <section className={styles.historia} aria-labelledby="historia-title">
      <div className={styles.stage}>
        <Image
          src="/assets/svg/perro-sentado.svg"
          alt=""
          aria-hidden="true"
          width={257}
          height={274}
          className={styles.perro}
        />

        <h2 id="historia-title" className={styles.title}>
          Nuestra historia
        </h2>

        <div className={styles.texto}>
          <p className={styles.lead}>Nos tomamos nuestro tiempo… para todo 🤍</p>

          <p>
            Dicen que las grandes historias empiezan con un flechazo. La nuestra
            necesitó unos meses para ponerse de acuerdo.
          </p>

          <p>
            Nos conocimos en noviembre de 2010 y, desde abril de 2011, no hemos
            dejado de escribir esta historia juntos.
          </p>

          <p className={styles.espaciado}>
            Entre viajes, deporte, paseos con nuestros perritos, libros, muchas
            risas y personas que hacen nuestra vida mejor, hemos aprendido que
            los mejores recuerdos nacen de los pequeños momentos.
          </p>

          <p className={styles.espaciado}>
            Y ahora comienza un nuevo capítulo, y no se nos ocurre mejor manera
            de empezarlo que celebrándolo con todos vosotros.
          </p>
        </div>

        <div className={styles.marco}>
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
