import Hero from "@/components/Hero";
import Historia from "@/components/Historia";
import DondeCuando from "@/components/DondeCuando";
import Detalles from "@/components/Detalles";
import CuentaAtras from "@/components/CuentaAtras";
import Rsvp from "@/components/Rsvp";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Historia />
        <DondeCuando />
        <Detalles />
        <CuentaAtras />
        <Rsvp />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
