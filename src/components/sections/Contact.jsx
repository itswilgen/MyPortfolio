import { useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import { SOCIAL_LINKS } from "../../constants/theme";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Replace with EmailJS or your own API call
    try {
      await new Promise((r) => setTimeout(r, 1200)); // simulate async
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200";

  return (
    <PageWrapper id="contact" className="py-24">
      <div className="section-container">
        {/* CTA banner */}
        <div
          className="relative rounded-3xl p-12 md:p-16 overflow-hidden mb-16"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(245,166,35,0.04))",
            border: "1px solid rgba(0,212,255,0.15)",
          }}
        >
          {/* Decorative sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 0%, rgba(0,212,255,0.04) 38%, rgba(245,166,35,0.035) 55%, transparent 74%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.38), rgba(245,166,35,0.3), transparent)",
            }}
          />

          <div className="text-center relative z-10">
            <span className="section-label">Contact</span>
            <h2
              className="font-display text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4"
            >
              Let's work together
            </h2>
            <p
              className="text-base max-w-md mx-auto mb-8 leading-[1.75]"
              style={{ color: "rgba(232,244,253,0.6)" }}
            >
              I'm currently open to freelance projects and collaborations. Have
              an idea? Let's build it.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="btn-primary glow-accent"
              >
                ✉ Send Email
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="max-w-xl mx-auto">
          <h3
            className="font-display text-2xl font-bold text-white mb-6 text-center"
          >
            Or send me a message
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <textarea
              name="message"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className={inputClass}
              style={{ resize: "vertical" }}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary w-full glow-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-center text-sm" style={{ color: "#22c55e" }}>
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm" style={{ color: "#ef4444" }}>
                Something went wrong. Please email me directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
