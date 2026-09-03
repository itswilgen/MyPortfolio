import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return <div className="section-container flex min-h-screen items-center justify-center py-24"><EmptyState title="Page not found" description="The page may have moved or the address may be incorrect." action={<Link to="/" className="btn-primary">Return home</Link>} /></div>;
}
