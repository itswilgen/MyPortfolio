import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import LoadingState from "./components/ui/LoadingState";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Home = lazy(() => import("./pages/Home"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProjectsAdmin = lazy(() => import("./pages/admin/ProjectsAdmin"));
const ProjectForm = lazy(() => import("./pages/admin/ProjectForm"));
const ProfileAdmin = lazy(() => import("./pages/admin/ProfileAdmin"));
const PaymentProofsAdmin = lazy(() => import("./pages/admin/PaymentProofsAdmin"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin"));
const ProjectPreview = lazy(() => import("./pages/admin/ProjectPreview"));
const CertificatesAdmin = lazy(() => import("./pages/admin/CertificatesAdmin"));
const CertificateForm = lazy(() => import("./pages/admin/CertificateForm"));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center"><LoadingState label="Loading page" /></div>}><Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="projects/:id/preview" element={<ProjectPreview />} />
        <Route path="certificates" element={<CertificatesAdmin />} />
        <Route path="certificates/new" element={<CertificateForm />} />
        <Route path="certificates/:id/edit" element={<CertificateForm />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="payment-proofs" element={<PaymentProofsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes></Suspense>
  );
}
