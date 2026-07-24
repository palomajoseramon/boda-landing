"use client";

import { useState } from "react";
import { useRevelar } from "./useRevelar";
import styles from "./Contacto.module.scss";

const IBAN = "ES43 1583 0001 1791 8543 8311";

const CONTACTOS = [
  { nombre: "Paloma", telefono: "652 607 370" },
  { nombre: "Jose Ramón", telefono: "675 907 925" },
];

/** Enlace a WhatsApp: requiere el número con prefijo y sin separadores. */
function enlaceWhatsapp(telefono: string) {
  return `https://wa.me/34${telefono.replace(/\s/g, "")}`;
}

export default function Contacto() {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(IBAN.replace(/\s/g, ""));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2400);
    } catch {
      // Si el navegador bloquea el portapapeles, el número queda visible
      // para copiarlo a mano.
      setCopiado(false);
    }
  }

  const { ref, visible } = useRevelar<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`${styles.seccion} ${visible ? styles.visible : ""}`}
      aria-labelledby="contacto-title"
    >
      <div className={styles.inner}>
        {/* ---------------- Número de cuenta ---------------- */}
        <div className={styles.cuenta}>
          <button
            type="button"
            className={styles.desplegable}
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="iban-panel"
          >
            <span className={`${styles.chevron} ${abierto ? styles.chevronAbierto : ""}`} aria-hidden="true">
              ⌄
            </span>
            Ver número de cuenta
            <span className={`${styles.chevron} ${abierto ? styles.chevronAbierto : ""}`} aria-hidden="true">
              ⌄
            </span>
          </button>

          {abierto && (
            <div id="iban-panel" className={styles.panel}>
              <button
                type="button"
                className={styles.iban}
                onClick={copiar}
                title="Copiar al portapapeles"
              >
                {IBAN}
              </button>
              <span className={styles.copiado} role="status">
                {copiado ? "¡Copiado!" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ---------------- Contacto ---------------- */}
        <h2 id="contacto-title" className={styles.title}>
          Contacto
        </h2>

        <ul className={styles.lista}>
          {CONTACTOS.map(({ nombre, telefono }) => (
            <li key={nombre} className={styles.fila}>
              <a
                href={enlaceWhatsapp(telefono)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlace}
              >
                <span className={styles.nombre}>{nombre}</span>
                <span className={styles.telefono}>{telefono}</span>
                <span className="visually-hidden">
                  (abrir conversación en WhatsApp)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
