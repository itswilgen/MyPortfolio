import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import ScrollTools from "../components/ui/ScrollTools";

const twinkleStars = [
  { x: "9%", y: "18%", size: "16px", delay: "0s", duration: "4.6s", angle: "18deg", color: "0, 212, 255" },
  { x: "18%", y: "42%", size: "10px", delay: "1.1s", duration: "5.8s", angle: "-12deg", color: "245, 166, 35" },
  { x: "29%", y: "14%", size: "12px", delay: "2.2s", duration: "5.1s", angle: "33deg", color: "255, 255, 255" },
  { x: "43%", y: "31%", size: "9px", delay: "0.7s", duration: "4.9s", angle: "8deg", color: "0, 212, 255" },
  { x: "58%", y: "20%", size: "14px", delay: "1.8s", duration: "6.2s", angle: "-24deg", color: "245, 166, 35" },
  { x: "71%", y: "38%", size: "11px", delay: "0.4s", duration: "5.5s", angle: "41deg", color: "255, 255, 255" },
  { x: "86%", y: "24%", size: "13px", delay: "2.8s", duration: "5.6s", angle: "-5deg", color: "0, 212, 255" },
  { x: "11%", y: "72%", size: "12px", delay: "3.1s", duration: "6.4s", angle: "25deg", color: "255, 255, 255" },
  { x: "34%", y: "66%", size: "8px", delay: "1.5s", duration: "4.7s", angle: "-35deg", color: "245, 166, 35" },
  { x: "52%", y: "78%", size: "15px", delay: "2.5s", duration: "6s", angle: "15deg", color: "0, 212, 255" },
  { x: "77%", y: "70%", size: "9px", delay: "0.9s", duration: "5.2s", angle: "-18deg", color: "255, 255, 255" },
  { x: "91%", y: "55%", size: "11px", delay: "3.5s", duration: "5.9s", angle: "31deg", color: "245, 166, 35" },
];

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-navy overflow-x-hidden">
      <div className="fixed inset-0 site-backdrop pointer-events-none z-0" />
      <div
        className="fixed inset-0 twinkle-stars pointer-events-none z-0"
        aria-hidden="true"
      >
        {twinkleStars.map((star) => (
          <span
            key={`${star.x}-${star.y}`}
            className="twinkle-star"
            style={{
              "--star-x": star.x,
              "--star-y": star.y,
              "--star-size": star.size,
              "--star-delay": star.delay,
              "--star-duration": star.duration,
              "--star-angle": star.angle,
              "--star-color": star.color,
            }}
          />
        ))}
      </div>
      <div className="fixed twinkle-circle pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10">
        <Outlet />
      </main>

      <Footer />
      <ScrollTools />
    </div>
  );
}
