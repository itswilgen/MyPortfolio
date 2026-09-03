import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingState from "../ui/LoadingState";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center"><LoadingState label="Checking your session" /></div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location, unauthorized: Boolean(user) }} />;
  return children;
}
