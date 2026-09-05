import { CalendarDays, Download, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import Modal from "../ui/Modal";

const formatDate = (value) => value
  ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })
  : "";

export default function CertificateViewer({ certificate, onClose }) {
  const actions = certificate ? (
    <>
      {certificate.verificationUrl && (
        <a className="btn-secondary" href={certificate.verificationUrl} target="_blank" rel="noreferrer">
          Verify credential <ExternalLink size={16} aria-hidden="true" />
        </a>
      )}
      {certificate.pdfUrl && (
        <a
          className="btn-secondary"
          href={certificate.pdfUrl}
          target="_blank"
          rel="noreferrer"
          download={certificate.allowDownload ? `${certificate.slug || "certificate"}.pdf` : undefined}
        >
          {certificate.allowDownload ? <Download size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
          {certificate.allowDownload ? "Download PDF" : "Open PDF"}
        </a>
      )}
      <button type="button" className="btn-primary" onClick={onClose}>Close</button>
    </>
  ) : null;

  return (
    <Modal
      open={Boolean(certificate)}
      title={certificate?.title || "Certificate"}
      onClose={onClose}
      actions={actions}
      panelClassName="certificate-dialog"
    >
      {certificate && (
        <div className="certificate-viewer">
          <div className="certificate-viewer-media">
            {certificate.imageUrl ? (
              <img src={certificate.imageUrl} alt={certificate.imageAlt} />
            ) : certificate.pdfUrl ? (
              <iframe src={`${certificate.pdfUrl}#toolbar=0`} title={`${certificate.title} PDF preview`} />
            ) : (
              <div className="certificate-file-placeholder"><FileText size={36} aria-hidden="true" /><span>Preview unavailable</span></div>
            )}
          </div>
          <div className="certificate-viewer-details">
            <div>
              <p className="certificate-issuer">{certificate.issuer}</p>
              <div className="certificate-date"><CalendarDays size={16} aria-hidden="true" /> Issued {formatDate(certificate.issueDate)}</div>
              {!certificate.doesNotExpire && certificate.expirationDate && <p className="certificate-expiry">Expires {formatDate(certificate.expirationDate)}</p>}
            </div>
            {certificate.description && <p>{certificate.description}</p>}
            {certificate.credentialId && <p className="credential-id"><ShieldCheck size={16} aria-hidden="true" /><span><strong>Credential ID</strong>{certificate.credentialId}</span></p>}
            {certificate.skills?.length > 0 && <div className="tag-list mt-0" aria-label="Related skills">{certificate.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>}
            {certificate.pdfUrl && <p className="certificate-pdf-fallback">If the preview is unavailable on your device, use the PDF action below to open the file safely.</p>}
          </div>
        </div>
      )}
    </Modal>
  );
}
