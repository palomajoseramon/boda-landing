import { NextResponse } from "next/server";

/** Cierre de confirmaciones: 4 de enero de 2027, fin del día. */
const CIERRE = new Date("2027-01-04T23:59:59+01:00").getTime();

type Payload = {
  nombre?: string;
  acompanante?: string;
  notas?: string;
  vegano?: string;
  bus?: string;
  vuelta?: string;
};

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

  const nombre = datos.nombre?.trim();
  const bus = datos.bus?.trim();

  if (!nombre) {
    return NextResponse.json(
      { error: "El nombre es obligatorio." },
      { status: 400 },
    );
  }

  if (bus !== "sí" && bus !== "no") {
    return NextResponse.json(
      { error: "Indica si necesitas autobús." },
      { status: 400 },
    );
  }

  if (bus === "sí" && !datos.vuelta) {
    return NextResponse.json(
      { error: "Indica dónde prefieres la vuelta." },
      { status: 400 },
    );
  }

  const registro = {
    fecha: new Date().toISOString(),
    nombre,
    acompanante: datos.acompanante?.trim() ?? "",
    notas: datos.notas?.trim() ?? "",
    vegano: datos.vegano ? "sí" : "no",
    bus,
    vuelta: bus === "sí" ? (datos.vuelta ?? "") : "",
  };

  // TODO: escribir en Google Sheets y enviar aviso con Resend en cuanto
  // estén disponibles las credenciales.
  console.log("[rsvp]", registro);

  return NextResponse.json({ ok: true });
}
