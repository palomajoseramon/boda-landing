import type { Metadata } from "next";
import { Instrument_Serif, Poppins, Space_Grotesk } from "next/font/google";
import "@/styles/globals.scss";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paloma & José Ramón · ¡Nos casamos!",
  description:
    "Después de tantos años caminando juntos, nos casamos el 23 de enero de 2027. Nos encantaría que nos acompañes en un día tan especial.",
  // Al compartir el enlace (WhatsApp, redes) se muestra esta tarjeta.
  openGraph: {
    title: "Paloma & José Ramón · ¡Nos casamos!",
    description:
      "El 23 de enero de 2027 empezamos un nuevo capítulo, y no se nos ocurre mejor manera de celebrarlo que contigo. ♡",
    type: "website",
    locale: "es_ES",
  },
  // Web privada de invitación: no interesa que la indexen los buscadores.
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#ff7f0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
