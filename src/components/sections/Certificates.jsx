import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSiteData } from "../../contexts/SiteDataContext";
import PageWrapper from "../../layouts/PageWrapper";
import CertificateCard from "../cards/CertificateCard";
import CertificateViewer from "../certificates/CertificateViewer";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

const defaultCopy = {
  eyebrow: "Learning & Credentials",
  heading: "Certificates and Achievements",
  intro: "A collection of certifications, training, and learning milestones that support my growth as a full-stack developer and UI/UX designer.",
};

export default function Certificates() {
  const { certificates, settings, loading } = useSiteData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const [featured, setFeatured] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const categories = useMemo(() => ["All", ...new Set(certificates.map((item) => item.category).filter(Boolean))], [certificates]);
  const years = useMemo(() => ["All", ...[...new Set(certificates.map((item) => item.issueDate?.slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a))], [certificates]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return certificates
      .filter((item) => !normalized || `${item.title} ${item.issuer}`.toLowerCase().includes(normalized))
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => year === "All" || item.issueDate?.startsWith(year))
      .filter((item) => featured === "All" || item.featured)
      .sort((a, b) => sort === "oldest"
        ? new Date(a.issueDate) - new Date(b.issueDate)
        : new Date(b.issueDate) - new Date(a.issueDate));
  }, [category, certificates, featured, query, sort, year]);
  const clearFilters = () => { setQuery(""); setCategory("All"); setYear("All"); setFeatured("All"); setSort("newest"); };
  const copy = {
    eyebrow: settings.certificateEyebrow || defaultCopy.eyebrow,
    heading: settings.certificateHeading || defaultCopy.heading,
    intro: settings.certificateIntro || defaultCopy.intro,
  };

  return (
    <PageWrapper id="certificates" className="section-block">
      <div className="section-container">
        <div className="section-heading-row reveal-item" style={{ "--reveal-index": 0 }}>
          <div><span className="section-kicker">{copy.eyebrow}</span><h2 className="section-heading">{copy.heading}</h2></div>
          <p className="section-intro">{copy.intro}</p>
        </div>
        {certificates.length >= 4 && (
          <div className="certificate-tools reveal-item" style={{ "--reveal-index": 1 }}>
            <label className="search-control certificate-search"><span>Search credentials</span><span className="relative block"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or organization" /></span></label>
            <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Year</span><select value={year} onChange={(event) => setYear(event.target.value)}>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Featured</span><select value={featured} onChange={(event) => setFeatured(event.target.value)}><option>All</option><option value="Featured">Featured only</option></select></label>
            <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
          </div>
        )}
        {loading ? <LoadingState label="Loading certificates" /> : filtered.length ? (
          <div className="certificate-grid">{filtered.map((certificate, index) => <CertificateCard certificate={certificate} onView={setSelected} revealIndex={index + 2} key={certificate.databaseId} />)}</div>
        ) : certificates.length ? (
          <EmptyState title="No certificates found" description="Try a different search, category, year, or featured filter." action={<button type="button" className="btn-secondary" onClick={clearFilters}>Clear filters</button>} />
        ) : (
          <EmptyState title="Credentials are being prepared" description="Verified certificates will appear here after they have been reviewed and published." />
        )}
      </div>
      <CertificateViewer certificate={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  );
}
