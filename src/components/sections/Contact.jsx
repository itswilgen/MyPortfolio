import { useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import { SOCIAL_LINKS } from "../../constants/theme";

const Icon = ({ children }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    className="h-5 w-5"
  >
    {children}
  </svg>
);

const MailIcon = () => (
  <Icon>
    <path
      d="M4 6.5h16v11H4v-11Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="m4.8 7.2 7.2 6 7.2-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const GitHubIcon = () => (
  <Icon>
    <path
      fill="currentColor"
      d="M12 2.2c-5.52 0-10 4.48-10 10 0 4.42 2.87 8.17 6.85 9.49.5.09.68-.22.68-.48v-1.7c-2.79.61-3.38-1.2-3.38-1.2-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.23-.25-4.57-1.11-4.57-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 7.16c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.35 4.69-4.58 4.94.36.31.68.92.68 1.86v2.6c0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12.2c0-5.52-4.48-10-10-10Z"
    />
  </Icon>
);

const FacebookIcon = () => (
  <Icon>
    <path
      fill="currentColor"
      d="M14.05 8.2h2.25V5h-2.65c-3.02 0-4.57 1.79-4.57 4.38v2.02H6.65v3.58h2.43V22h3.68v-7.02h2.98l.47-3.58h-3.45V9.74c0-1.03.28-1.54 1.29-1.54Z"
    />
  </Icon>
);

const CopyIcon = () => (
  <Icon>
    <path
      d="M9 9h10v10H9V9Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M5 15V5h10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const CheckIcon = () => (
  <Icon>
    <path
      d="m5 12.5 4.2 4.2L19 6.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [copyStatus, setCopyStatus] = useState("idle");

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL_LINKS.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 1800);
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
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">
              Let's work together
            </h2>
            <p
              className="text-base max-w-md mx-auto mb-8 leading-[1.75]"
              style={{ color: "rgba(232,244,253,0.6)" }}
            >
              I'm currently open to freelance projects and collaborations. Have
              an idea? Let's build it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="contact-icon-button contact-icon-button-primary glow-accent"
                aria-label="Send email"
                title="Send email"
              >
                <MailIcon />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="contact-icon-button"
                aria-label="Open GitHub profile"
                title="GitHub profile"
              >
                <GitHubIcon />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="contact-icon-button contact-icon-button-facebook"
                aria-label="Open Facebook profile"
                title="Facebook profile"
              >
                <FacebookIcon />
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="contact-icon-button"
                aria-label={
                  copyStatus === "copied" ? "Email copied" : "Copy email"
                }
                title={copyStatus === "copied" ? "Email copied" : "Copy email"}
              >
                {copyStatus === "copied" ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            {copyStatus === "error" && (
              <p
                className="mt-4 text-xs font-medium"
                style={{ color: "rgba(232,244,253,0.55)" }}
              >
                Copy failed. Email me at {SOCIAL_LINKS.email}.
              </p>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div className="max-w-xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-white mb-6 text-center">
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
              {status === "sending" ? "Submitting..." : "Submit"}
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
