import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import { useTilt } from "../../hooks/useTilt";
import PageWrapper from "../../layouts/PageWrapper";
import EmptyState from "../ui/EmptyState";
import Modal from "../ui/Modal";

function ProofCard({ proof, onPreview, revealIndex }) {
  const tilt = useTilt({ max: 6, scale: 1.015, perspective: 1000 });

  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="proof-card tilt-card reveal-item group"
      style={{ "--reveal-index": revealIndex }}
    >
      <span className="tilt-card-glare" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onPreview(proof)}
        aria-label={`Preview payment proof for ${proof.project_or_service}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-line"
      >
        <img
          src={proof.imageUrl}
          alt={proof.image_alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <CheckCircle2 size={14} className="text-emerald-400" /> Click to
            view proof
          </span>
        </div>
      </button>
      <div className="proof-copy">
        <h3 className="group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors font-display text-lg font-bold">
          {proof.project_or_service}
        </h3>
        {proof.description && (
          <p className="mt-2 text-sm leading-6 text-muted">
            {proof.description}
          </p>
        )}
        <div className="proof-meta mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted">
          <span className="text-ink font-bold">{proof.client_label}</span>
          {proof.payment_platform && <span>{proof.payment_platform}</span>}
          {proof.payment_date && (
            <time dateTime={proof.payment_date}>
              {new Date(`${proof.payment_date}T00:00:00`).toLocaleDateString()}
            </time>
          )}
          {proof.amount && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {proof.currency} {Number(proof.amount).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function PaymentProofs() {
  const { paymentProofs } = useSiteData();
  const [preview, setPreview] = useState(null);

  return (
    <PageWrapper id="client-trust" className="section-block">
      <div className="section-container">
        <div
          className="section-heading-row reveal-item"
          style={{ "--reveal-index": 0 }}
        >
          <div>
            <span className="section-kicker">Client Trust & Delivery</span>
            <h2 className="section-heading">
              Work completed, handled with care.
            </h2>
          </div>
          <p className="section-intro">
            A privacy-conscious record of completed freelance engagements.
            Sensitive details are removed before anything is published.
          </p>
        </div>

        {paymentProofs.length ? (
          <div className="trust-grid">
            {paymentProofs.map((proof, index) => (
              <ProofCard
                key={proof.id}
                proof={proof}
                onPreview={setPreview}
                revealIndex={index + 1}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No public records yet"
            description="Payment records appear here only after they have been reviewed, redacted, and intentionally published."
          />
        )}

        <div
          className="privacy-note reveal-item flex items-center gap-3"
          style={{ "--reveal-index": paymentProofs.length + 1 }}
        >
          <ShieldCheck
            className="text-emerald-500 shrink-0"
            size={20}
            aria-hidden="true"
          />
          <span>
            Privacy comes first: account details, reference numbers, QR codes,
            and private client information are never intentionally displayed.
          </span>
        </div>
      </div>

      <Modal
        open={Boolean(preview)}
        title={preview?.project_or_service || "Payment proof"}
        onClose={() => setPreview(null)}
      >
        {preview && (
          <div className="overflow-hidden rounded-lg bg-slate-950 p-2">
            <img
              src={preview.imageUrl}
              alt={preview.image_alt}
              className="max-h-[68vh] w-full object-contain mx-auto"
            />
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
