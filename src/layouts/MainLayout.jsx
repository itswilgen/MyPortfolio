import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import ScrollTools from "../components/ui/ScrollTools";
import AmbientBackground from "../components/ui/AmbientBackground";

export default function MainLayout() {
  return (
    <div className="app-shell relative isolate">
      <AmbientBackground />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollTools />
    </div>
  );
}
