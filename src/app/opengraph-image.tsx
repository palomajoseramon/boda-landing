import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Tarjeta de vista previa al compartir el enlace (WhatsApp, redes).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Paloma & José Ramón · ¡Nos casamos! · 23 de enero de 2027";

export default async function Image() {
  // El logo del hero, rasterizado, embebido como data URI.
  const logo = await readFile(
    join(process.cwd(), "public/assets/img/logo-og.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={520} alt="" />
      </div>
    ),
    { ...size },
  );
}
