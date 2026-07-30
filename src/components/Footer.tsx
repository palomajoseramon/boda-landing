"use client";

import Image from "next/image";
import { useRevelar } from "./useRevelar";
import styles from "./Footer.module.scss";

export default function Footer() {
  const { ref, visible } = useRevelar<HTMLElement>();

  return (
    <footer
      ref={ref}
      className={`${styles.footer} ${visible ? styles.visible : ""}`}
    >
      <div className={styles.inner}>
        <p className={styles.claim}>¡Te esperamos!</p>

        <div className={styles.perros} aria-hidden="true">
          <Image
            src="/assets/svg/footer-perro-1.svg"
            alt=""
            width={214}
            height={214}
            className={styles.perro}
          />
          <Image
            src="/assets/svg/footer-perro-2.svg"
            alt=""
            width={204}
            height={204}
            className={styles.perro}
          />
        </div>

        <h2 className={styles.logoCaja}>
          <Image
            src="/assets/svg/logo-footer.svg"
            alt="Paloma & José Ramón"
            width={1449}
            height={358}
            className={styles.logo}
          />
        </h2>

        <p className={styles.frase}>
          Después de tantos años caminando juntos, <br />
          tenemos claro que el mejor destino siempre <br />
          ha sido compartir el camino.
        </p>

        <div className={styles.cierre}>
          <p className={styles.gracias}>Gracias por formar parte de él</p>
          <p className={styles.fecha}>
            <time dateTime="2027-01-23">23 · 01 · 2027</time>
            <span className={styles.corazon} aria-hidden="true">
              ♡
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
