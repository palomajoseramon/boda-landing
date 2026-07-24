import { NextResponse } from "next/server";

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

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...registro, token }),
      // Apps Script responde con una redirección que hay que seguir
      redirect: "follow",
    });

    const cuerpo = await res.json();

    if (!res.ok || cuerpo.error) {
      throw new Error(cuerpo.error ?? `HTTP ${res.status}`);
    }
  } catch (error) {
    // La confirmación no se ha guardado: conviene que quede rastro
    console.error("[rsvp] fallo al escribir en la hoja:", error);
    return NextResponse.json(
      { error: "No hemos podido guardar la confirmación." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
