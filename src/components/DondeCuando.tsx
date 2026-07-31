"use client";

import Image from "next/image";
import { useRevelar } from "./useRevelar";
import styles from "./DondeCuando.module.scss";

const MAPS = {
  ermita: "https://maps.app.goo.gl/wuinvzLYv49Gn3wD8",
  masia: "https://maps.app.goo.gl/cAtD36HbLurVyy45A",
};

export default function DondeCuando() {
  // Observadores independientes y con umbrales distintos: en desktop los
  // tres bloques están casi a la misma altura, así que sin escalonar el
  // disparo entrarían todos a la vez.
  const cabecera = useRevelar<HTMLElement>();
  const ilustracion = useRevelar<HTMLDivElement>({ margen: "0px 0px -32% 0px" });
  const horarios = useRevelar<HTMLDivElement>({ margen: "0px 0px -38% 0px" });

  return (
    <section className={styles.seccion} aria-labelledby="donde-title">
      <div className={styles.stage}>
        <header
          ref={cabecera.ref}
          className={`${styles.encabezado} ${cabecera.visible ? styles.visible : ""}`}
        >
          <h2 id="donde-title" className={styles.title}>
            Dónde y cuándo
          </h2>
          <p className={styles.fecha}>Sábado 23 de enero de 2027</p>
        </header>

        <div
          ref={ilustracion.ref}
          className={`${styles.ermita} ${ilustracion.visible ? styles.visible : ""}`}
        >
          <Image
            src="/assets/svg/ermita.svg"
            alt=""
            aria-hidden="true"
            width={1037}
            height={645}
            className={styles.ermitaImg}
          />
        </div>

        <div
          ref={horarios.ref}
          className={`${styles.info} ${horarios.visible ? styles.visible : ""}`}
        >
          <div className={styles.bloque}>
            <h3 className={styles.hora}>12:00h Ceremonia</h3>
            <p className={styles.lugar}>
              <a
                href={MAPS.ermita}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlace}
              >
                Ermita Santa Ana (Albal)
                <span className={styles.flecha} aria-hidden="true">
                  ↗
                </span>
                <span className="visually-hidden">(abre Google Maps)</span>
              </a>
            </p>
          </div>

          <div className={styles.bloque}>
            <h3 className={styles.hora}>15:30h Banquete</h3>
            <p className={styles.lugar}>
              <a
                href={MAPS.masia}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlace}
              >
                La Masía del Olivar (Bétera)
                <span className={styles.flecha} aria-hidden="true">
                  ↗
                </span>
                <span className="visually-hidden">(abre Google Maps)</span>
              </a>
            </p>
          </div>

          <div className={styles.buses}>
            <p className={styles.busesTitulo}>Buses</p>
            <p>Servicio de autobús desde Albal.</p>
            <p className={styles.busesDestacado}>
              Para que el único plan sea disfrutar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
