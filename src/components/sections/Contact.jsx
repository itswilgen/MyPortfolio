import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Mail,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { DEFAULT_PROFILE } from "../../data/profile";
import { useTilt } from "../../hooks/useTilt";
import PageWrapper from "../../layouts/PageWrapper";

export default function Contact() {
  const { profile } = useSiteData();
  const content = profile || DEFAULT_PROFILE;
  const [copied, setCopied] = useState(false);
  const tilt = useTilt({ max: 3, scale: 1.008, perspective: 1200 });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API fails
      setCopied(false);
    }
  };

  const links = [
    ["GitHub", content.socialLinks.github, Code2],
    ["LinkedIn", content.socialLinks.linkedin, BriefcaseBusiness],
    ["Facebook", content.socialLinks.facebook, UsersRound],
  ].filter(([, href]) => href);

  return (
    <PageWrapper id="contact" className="section-block">
      <div className="section-container">
        <div
          ref={tilt.ref}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          className="contact-panel tilt-card reveal-item group relative"
          style={{ "--reveal-index": 0 }}
        >
          <span className="tilt-card-glare" aria-hidden="true" />
          <div className="contact-copy relative z-10">
            <span className="section-kicker">
              <Sparkles size={14} className="text-amber-500" /> Start a
              conversation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              Have a product, system, or interface to build?
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              {content.availability ||
                "I’m open to discussing thoughtful web projects and collaborations."}{" "}
              Tell me what you’re working on and where you need help.
            </p>
            <div className="contact-actions mt-8 flex flex-wrap gap-3">
              <a className="btn-primary" href={`mailto:${content.email}`}>
                <Mail size={18} /> Email {content.name.split(" ")[0]}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-secondary"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check size={17} className="text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={17} /> Copy email
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="contact-links relative z-10">
            <a className="contact-link" href={`mailto:${content.email}`}>
              <span className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-cyan-600 dark:text-cyan-400 shrink-0"
                />
                <span className="truncate">{content.email}</span>
              </span>
              <ArrowUpRight size={17} className="shrink-0" />
            </a>
            {links.map(([label, href, Icon]) => (
              <a
                className="contact-link"
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-cyan-600 dark:text-cyan-400 shrink-0"
                  />
                  <span>{label}</span>
                </span>
                <ArrowUpRight size={17} className="shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
