import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import PageWrapper from "../../layouts/PageWrapper";
import EmptyState from "../ui/EmptyState";
import Modal from "../ui/Modal";

export default function PaymentProofs() {
  const { paymentProofs } = useSiteData();
  const [preview, setPreview] = useState(null);
  return (
    <PageWrapper id="client-trust" className="section-block">
      <div className="section-container">
        <div className="section-heading-row">
          <div><span className="section-kicker">Client trust</span><h2 className="section-heading">Work completed, handled with care.</h2></div>
          <p className="section-intro">A privacy-conscious record of completed freelance engagements. Sensitive details are removed before anything is published.</p>
        </div>
        {paymentProofs.length ? <div className="trust-grid">
          {paymentProofs.map((proof) => <article className="proof-card" key={proof.id}>
            <button type="button" onClick={() => setPreview(proof)} aria-label={`Preview payment proof for ${proof.project_or_service}`}><img src={proof.imageUrl} alt={proof.image_alt} loading="lazy" /></button>
            <div className="proof-copy"><h3>{proof.project_or_service}</h3>{proof.description && <p>{proof.description}</p>}<div className="proof-meta"><span>{proof.client_label}</span>{proof.payment_platform && <span>{proof.payment_platform}</span>}{proof.payment_date && <time dateTime={proof.payment_date}>{new Date(`${proof.payment_date}T00:00:00`).toLocaleDateString()}</time>}{proof.amount && <span>{proof.currency} {Number(proof.amount).toLocaleString()}</span>}</div></div>
          </article>)}
        </div> : <EmptyState title="No public records yet" description="Payment records appear here only after they have been reviewed, redacted, and intentionally published." />}
        <div className="privacy-note"><ShieldCheck className="mr-2 inline" size={18} aria-hidden="true" /> Privacy comes first: account details, reference numbers, QR codes, and private client information are never intentionally displayed.</div>
      </div>
      <Modal open={Boolean(preview)} title={preview?.project_or_service || "Payment proof"} onClose={() => setPreview(null)}>
        {preview && <img src={preview.imageUrl} alt={preview.image_alt} className="max-h-[65vh] w-full object-contain" />}
      </Modal>
    </PageWrapper>
  );
}
