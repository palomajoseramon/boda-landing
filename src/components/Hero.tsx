import Image from "next/image";
import styles from "./Hero.module.scss";

/**
 * El SVG del logotipo contiene los nombres y los dos perros.
 * El claim y la fecha son texto real (Poppins Light) posicionados en
 * porcentajes sobre el propio logotipo, de modo que la composición
 * escala como una unidad.
 */
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image
        src="/assets/svg/adorno-hero.svg"
        alt=""
        aria-hidden="true"
        width={742}
        height={915}
        className={`${styles.adorno} ${styles.adornoLeft}`}
        priority
      />
      <Image
        src="/assets/svg/adorno-hero.svg"
        alt=""
        aria-hidden="true"
        width={742}
        height={915}
        className={`${styles.adorno} ${styles.adornoRight}`}
        priority
      />

      {/* Lienzo con la proporción exacta del SVG (883.48 × 798.56).
          Todo lo que va dentro se posiciona en % sobre esa caja. */}
      <div className={styles.stage}>
        <h1 id="hero-title" className={styles.title}>
          <Image
            src="/assets/svg/logo-hero.svg"
            alt="Paloma &amp; José Ramón"
            width={883}
            height={799}
            className={styles.logo}
            priority
          />
        </h1>

        <p className={styles.eyebrow}>¡Nos casamos!</p>

        <p className={styles.date}>
          <time dateTime="2027-01-23">23 / 01 / 2027</time>
        </p>
      </div>
    </section>
  );
}
