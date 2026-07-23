"use client";

import { useState } from "react";
import styles from "./Rsvp.module.scss";

/** Cierre de confirmaciones: 4 de enero de 2027, fin del día. */
const CIERRE = new Date("2027-01-04T23:59:59+01:00").getTime();

type Estado = "listo" | "enviando" | "ok" | "error";

export default function Rsvp() {
  const [estado, setEstado] = useState<Estado>("listo");
  const [mensaje, setMensaje] = useState("");
  const [nombre, setNombre] = useState("");
  const [necesitaBus, setNecesitaBus] = useState<string>("");
  const [vuelta, setVuelta] = useState<string>("");

  const plazoCerrado = Date.now() > CIERRE;

  // El botón permanece inactivo hasta que las respuestas obligatorias
  // estén completas: nombre, autobús y —si va en autobús— parada de vuelta.
  const completo =
    nombre.trim() !== "" &&
    (necesitaBus === "no" || (necesitaBus === "sí" && vuelta !== ""));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Se guarda la referencia antes del await: React limpia currentTarget
    // en cuanto termina el manejador del evento.
    const formulario = e.currentTarget;

    setEstado("enviando");
    setMensaje("");

    const datos = Object.fromEntries(new FormData(formulario));

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!res.ok) throw new Error(await res.text());

      setEstado("ok");
      setMensaje("¡Confirmación recibida! Nos vemos el 23 de enero.");
      formulario.reset();
      setNombre("");
      setNecesitaBus("");
      setVuelta("");
    } catch {
      setEstado("error");
      setMensaje(
        "No hemos podido guardar tu confirmación. Inténtalo de nuevo o escríbenos por WhatsApp.",
      );
    }
  }

  return (
    <section className={styles.seccion} aria-labelledby="rsvp-title">
      <div className={styles.inner}>
        <header className={styles.encabezado}>
          <h2 id="rsvp-title" className={styles.title}>
            Confírmanos tu asistencia
          </h2>
          <p className={styles.fecha}>23 . 01 . 2027</p>
        </header>

        {plazoCerrado ? (
          <div className={styles.cerrado} role="status">
            <p>
              El plazo de confirmación se cerró el 4 de enero de 2027. Si
              necesitas decirnos algo, llámanos y lo vemos.
            </p>
          </div>
        ) : (
          <form className={styles.marco} onSubmit={onSubmit} noValidate={false}>
            <div className={styles.columnas}>
              {/* ---------------- Columna izquierda ---------------- */}
              <div className={styles.colIzquierda}>
                <div className={styles.campo}>
                  <label htmlFor="nombre" className={styles.label}>
                    Nombre y apellidos
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    className={styles.input}
                    placeholder="Nombre y apellidos"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="acompanante" className={styles.label}>
                    Nombre y apellidos (si sois dos)
                  </label>
                  <input
                    id="acompanante"
                    name="acompanante"
                    type="text"
                    className={styles.input}
                    placeholder="Nombre y apellidos (si sois dos)"
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="notas" className={styles.label}>
                    Escribe tus dudas, alergias, intolerancias
                  </label>
                  <textarea
                    id="notas"
                    name="notas"
                    rows={2}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Escribe tus dudas, alergias, intolerancias"
                  />
                </div>

                <label className={styles.check}>
                  <input type="checkbox" name="vegano" value="sí" />
                  <span className={styles.marca} aria-hidden="true" />
                  <span className={styles.checkTexto}>Menú vegano</span>
                </label>
              </div>

              {/* ---------------- Columna derecha ---------------- */}
              <div className={styles.colDerecha}>
                <fieldset className={styles.grupo}>
                  <legend className={styles.pregunta}>
                    ¿Necesitarás autobús?
                  </legend>

                  <div className={styles.opciones}>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="bus"
                        value="sí"
                        required
                        checked={necesitaBus === "sí"}
                        onChange={(e) => {
                          setNecesitaBus(e.target.value);
                          if (e.target.value === "no") setVuelta("");
                        }}
                      />
                      <span className={styles.marca} aria-hidden="true" />
                      <span className={styles.radioTexto}>Sí</span>
                    </label>

                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="bus"
                        value="no"
                        checked={necesitaBus === "no"}
                        onChange={(e) => {
                          setNecesitaBus(e.target.value);
                          if (e.target.value === "no") setVuelta("");
                        }}
                      />
                      <span className={styles.marca} aria-hidden="true" />
                      <span className={styles.radioTexto}>
                        No, iré por mi cuenta
                      </span>
                    </label>
                  </div>
                </fieldset>

                <fieldset
                  className={styles.grupo}
                  disabled={necesitaBus !== "sí"}
                >
                  <legend className={styles.pregunta}>
                    Si has elegido sí, ¿dónde prefieres la vuelta?*
                  </legend>

                  <div className={styles.opciones}>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="vuelta"
                        value="Valencia"
                        required={necesitaBus === "sí"}
                        checked={vuelta === "Valencia"}
                        onChange={(e) => setVuelta(e.target.value)}
                      />
                      <span className={styles.marca} aria-hidden="true" />
                      <span className={styles.radioTexto}>Valencia</span>
                    </label>

                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="vuelta"
                        value="Albal"
                        required={necesitaBus === "sí"}
                        checked={vuelta === "Albal"}
                        onChange={(e) => setVuelta(e.target.value)}
                      />
                      <span className={styles.marca} aria-hidden="true" />
                      <span className={styles.radioTexto}>Albal</span>
                    </label>
                  </div>
                </fieldset>

                <p className={styles.nota}>
                  *La ida será desde <strong>Albal</strong> hasta la{" "}
                  <strong>Masía del Olivar.</strong>
                </p>

                <div className={styles.accion}>
                  <button
                    type="submit"
                    className={styles.boton}
                    disabled={!completo || estado === "enviando"}
                  >
                    {estado === "enviando" ? (
                      <>
                        <span className={styles.loader} aria-hidden="true" />
                        Enviando
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {mensaje && (
              <p
                className={`${styles.aviso} ${
                  estado === "error" ? styles.avisoError : styles.avisoOk
                }`}
                role="status"
              >
                {mensaje}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
