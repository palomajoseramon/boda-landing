import { NextResponse } from "next/server";

// Apps Script tarda a veces 20s o más en responder. El default de Vercel son
// 10s: sin esto, la función se cortaba antes de recibir la confirmación y el
// usuario veía un error aunque la fila se hubiera escrito. 60s da margen de
// sobra (máximo del plan gratuito).
export const maxDuration = 60;

/** Cierre de confirmaciones: 4 de enero de 2027, fin del día. */
const CIERRE = new Date("2027-01-04T23:59:59+01:00").getTime();

type Persona = {
  nombre?: string;
  vegano?: boolean;
  bus?: string;
  vuelta?: string;
};

type Payload = {
  titular?: Persona;
  acompanante?: Persona | null;
  notas?: string;
};

/** Comprueba que una persona trae respuestas coherentes. */
function validarPersona(p: Persona | undefined, etiqueta: string) {
  if (!p?.nombre?.trim()) {
    return `Falta el nombre de ${etiqueta}.`;
  }

  if (p.bus !== "sí" && p.bus !== "no") {
    return `Indica si ${etiqueta} necesita autobús.`;
  }

  if (p.bus === "sí" && !p.vuelta) {
    return `Indica dónde prefiere la vuelta ${etiqueta}.`;
  }

  return null;
}

/** Normaliza una persona a las columnas que se guardan. */
function aFila(p: Persona) {
  return {
    nombre: p.nombre!.trim(),
    vegano: p.vegano ? "sí" : "no",
    bus: p.bus!,
    vuelta: p.bus === "sí" ? (p.vuelta ?? "") : "",
  };
}

export async function POST(request: Request) {
  // El plazo se comprueba también en servidor: el cliente puede saltárselo.
  if (Date.now() > CIERRE) {
    return NextResponse.json(
      { error: "El plazo de confirmación está cerrado." },
      { status: 403 },
    );
  }

  let datos: Payload;

  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const errorTitular = validarPersona(datos.titular, "la primera persona");
  if (errorTitular) {
    return NextResponse.json({ error: errorTitular }, { status: 400 });
  }

  const tieneAcompanante = Boolean(datos.acompanante?.nombre?.trim());

  if (tieneAcompanante) {
    const errorAcompanante = validarPersona(
      datos.acompanante!,
      "el acompañante",
    );
    if (errorAcompanante) {
      return NextResponse.json({ error: errorAcompanante }, { status: 400 });
    }
  }

  const registro = {
    titular: aFila(datos.titular!),
    acompanante: tieneAcompanante ? aFila(datos.acompanante!) : null,
    notas: datos.notas?.trim() ?? "",
  };

  const url = process.env.RSVP_SHEET_URL;
  const token = process.env.RSVP_TOKEN;

  // Sin credenciales configuradas se registra en consola: permite probar el
  // formulario en local sin depender de la hoja.
  if (!url || !token) {
    console.log("[rsvp] sin destino configurado:", JSON.stringify(registro));
    return NextResponse.json({ ok: true });
  }

  // Solo se confirma al usuario si el script responde un OK inequívoco
  // ({"ok":true}). Confirmar en caso de duda sería peor que un falso error:
  // alguien creería estar apuntado sin estarlo. Vercel corta a los 60s, así
  // que se espera hasta 50s para dar margen a la respuesta de Google.
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 50000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...registro, token }),
      redirect: "follow",
      signal: controlador.signal,
    });

    const texto = await res.text();
    let ok = false;
    try {
      const cuerpo = JSON.parse(texto);
      ok = cuerpo?.ok === true;
    } catch {
      // Cuerpo no parseable: no hay confirmación fiable → se trata como fallo
    }

    if (!res.ok || !ok) {
      throw new Error(`respuesta inesperada del script (HTTP ${res.status})`);
    }
  } catch (error) {
    // Cualquier duda (timeout, red, respuesta no confirmada) se reporta como
    // no guardado. Es preferible pedir que reintenten a dar por hecho algo
    // que quizá no ocurrió.
    console.error("[rsvp] no se pudo confirmar el guardado:", error);
    return NextResponse.json(
      {
        error:
          "No hemos podido confirmar tu asistencia. Vuelve a intentarlo en un momento; si sigue sin funcionar, escríbenos por WhatsApp.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  return NextResponse.json({ ok: true });
}
