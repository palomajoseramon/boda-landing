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
  title: "Paloma & José Ramón · 23.01.2027",
  description:
    "Nos casamos el 23 de enero de 2027. Confirma tu asistencia y consulta todos los detalles de la celebración.",
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
