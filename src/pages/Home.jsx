import Hero from "../components/sections/Hero";
import Stats from "../components/sections/Stats";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
