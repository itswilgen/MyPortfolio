import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import PaymentProofs from "../components/sections/PaymentProofs";
import Contact from "../components/sections/Contact";
import Certificates from "../components/sections/Certificates";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <PaymentProofs />
      <Contact />
    </>
  );
}
