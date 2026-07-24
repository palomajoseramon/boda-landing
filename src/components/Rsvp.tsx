"use client";

import { useState } from "react";
import { useRevelar } from "./useRevelar";
import styles from "./Rsvp.module.scss";

/** Cierre de confirmaciones: 4 de enero de 2027, fin del día. */
const CIERRE = new Date("2027-01-04T23:59:59+01:00").getTime();

type Estado = "listo" | "enviando" | "ok" | "error";

/** Respuestas de una persona: cada asistente elige por separado. */
type Persona = {
  nombre: string;
  vegano: boolean;
  bus: string;
  vuelta: string;
};

const PERSONA_VACIA: Persona = {
  nombre: "",
  vegano: false,
  bus: "",
  vuelta: "",
};

type BloqueProps = {
  persona: Persona;
  quien: "titular" | "acompanante";
  titulo: string;
  onCambio: (quien: "titular" | "acompanante", cambios: Partial<Persona>) => void;
};

/**
 * Preguntas de una persona. Se define fuera del componente principal para
 * que React conserve la identidad de los campos entre renders y no se
 * pierda el foco al escribir.
 */
function BloquePersona({ persona, quien, titulo, onCambio }: BloqueProps) {
  return (
    <div className={styles.persona}>
      <p className={styles.personaTitulo}>{titulo}</p>

      <fieldset className={styles.grupo}>
        <legend className={styles.pregunta}>¿Necesitarás autobús?</legend>

        <div className={styles.opciones}>
          <label className={styles.radio}>
            <input
              type="radio"
              name={`${quien}-bus`}
              value="sí"
              checked={persona.bus === "sí"}
              onChange={() => onCambio(quien, { bus: "sí" })}
            />
            <span className={styles.marca} aria-hidden="true" />
            <span className={styles.radioTexto}>Sí</span>
          </label>

          <label className={styles.radio}>
            <input
              type="radio"
              name={`${quien}-bus`}
              value="no"
              checked={persona.bus === "no"}
              onChange={() => onCambio(quien, { bus: "no" })}
            />
            <span className={styles.marca} aria-hidden="true" />
            <span className={styles.radioTexto}>No, iré por mi cuenta</span>
          </label>
        </div>
      </fieldset>

      {/* La parada de vuelta solo tiene sentido si va en autobús: aparece
          al elegir "sí" en lugar de ocupar sitio permanentemente. */}
      {persona.bus === "sí" && (
        <fieldset className={`${styles.grupo} ${styles.grupoDesplegado}`}>
          <legend className={styles.pregunta}>
            ¿Dónde prefieres la vuelta?*
          </legend>

          <div className={styles.opciones}>
            {["Valencia", "Albal"].map((parada) => (
              <label key={parada} className={styles.radio}>
                <input
                  type="radio"
                  name={`${quien}-vuelta`}
                  value={parada}
                  checked={persona.vuelta === parada}
                  onChange={() => onCambio(quien, { vuelta: parada })}
                />
                <span className={styles.marca} aria-hidden="true" />
                <span className={styles.radioTexto}>{parada}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className={styles.check}>
        <input
          type="checkbox"
          name={`${quien}-vegano`}
          checked={persona.vegano}
          onChange={(e) => onCambio(quien, { vegano: e.target.checked })}
        />
        <span className={styles.marca} aria-hidden="true" />
        <span className={styles.checkTexto}>Menú vegano</span>
      </label>
    </div>
  );
}

export default function Rsvp() {
  const [estado, setEstado] = useState<Estado>("listo");
  const [mensaje, setMensaje] = useState("");
  const [notas, setNotas] = useState("");
  const [titular, setTitular] = useState<Persona>(PERSONA_VACIA);
  const [acompanante, setAcompanante] = useState<Persona>(PERSONA_VACIA);

  const cabecera = useRevelar<HTMLElement>();
  // El mismo ref se aplica al formulario o al aviso de plazo cerrado
  const cuerpo = useRevelar<HTMLElement>();

  const plazoCerrado = Date.now() > CIERRE;
  const hayAcompanante = acompanante.nombre.trim() !== "";

  /** Una persona está completa si eligió autobús y, en su caso, la vuelta. */
  function personaCompleta(p: Persona) {
    return p.bus === "no" || (p.bus === "sí" && p.vuelta !== "");
  }

  const completo =
    titular.nombre.trim() !== "" &&
    personaCompleta(titular) &&
    (!hayAcompanante || personaCompleta(acompanante));

  function actualizar(
    quien: "titular" | "acompanante",
    cambios: Partial<Persona>,
  ) {
    const set = quien === "titular" ? setTitular : setAcompanante;
    set((prev) => {
      const siguiente = { ...prev, ...cambios };
      // Elegir "no" en autobús deja sin sentido la parada de vuelta
      if (cambios.bus === "no") siguiente.vuelta = "";
      return siguiente;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setEstado("enviando");
    setMensaje("");

    const cuerpoEnvio = {
      titular,
      acompanante: hayAcompanante ? acompanante : null,
      notas,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoEnvio),
      });

      if (!res.ok) throw new Error(await res.text());

      setEstado("ok");
      setMensaje("¡Confirmación recibida! Nos vemos el 23 de enero.");
      setTitular(PERSONA_VACIA);
      setAcompanante(PERSONA_VACIA);
      setNotas("");
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
        <header
          ref={cabecera.ref}
          className={`${styles.encabezado} ${cabecera.visible ? styles.visible : ""}`}
        >
          <h2 id="rsvp-title" className={styles.title}>
            Confírmanos tu asistencia
          </h2>
          <p className={styles.fecha}>23 . 01 . 2027</p>
        </header>

        {plazoCerrado ? (
          <div
            ref={cuerpo.ref as React.Ref<HTMLDivElement>}
            className={`${styles.cerrado} ${cuerpo.visible ? styles.visible : ""}`}
            role="status"
          >
            <p>
              El plazo de confirmación se cerró el 4 de enero de 2027. Si
              necesitas decirnos algo, llámanos y lo vemos.
            </p>
          </div>
        ) : (
          <form
            ref={cuerpo.ref as React.Ref<HTMLFormElement>}
            className={`${styles.marco} ${cuerpo.visible ? styles.visible : ""}`}
            onSubmit={onSubmit}
          >
            <div className={styles.columnas}>
              {/* ---------------- Columna izquierda: nombres ---------------- */}
              <div className={styles.colIzquierda}>
                <div className={styles.campo}>
                  <label htmlFor="nombre" className={styles.label}>
                    Nombre y apellidos
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    className={styles.input}
                    placeholder="Nombre y apellidos"
                    value={titular.nombre}
                    onChange={(e) =>
                      actualizar("titular", { nombre: e.target.value })
                    }
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="acompanante" className={styles.label}>
                    Nombre y apellidos (si sois dos)
                  </label>
                  <input
                    id="acompanante"
                    type="text"
                    className={styles.input}
                    placeholder="Nombre y apellidos (si sois dos)"
                    value={acompanante.nombre}
                    onChange={(e) =>
                      actualizar("acompanante", { nombre: e.target.value })
                    }
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="notas" className={styles.label}>
                    Escribe tus dudas, alergias, intolerancias
                  </label>
                  <textarea
                    id="notas"
                    rows={3}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Escribe tus dudas, alergias, intolerancias"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </div>

              {/* ---------------- Columna derecha: opciones ---------------- */}
              <div className={styles.colDerecha}>
                <BloquePersona
                  persona={titular}
                  quien="titular"
                  onCambio={actualizar}
                  titulo={
                    hayAcompanante
                      ? titular.nombre.trim() || "Primera persona"
                      : "Tus opciones"
                  }
                />

                {hayAcompanante && (
                  <BloquePersona
                    persona={acompanante}
                    quien="acompanante"
                    onCambio={actualizar}
                    titulo={acompanante.nombre.trim()}
                  />
                )}

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
