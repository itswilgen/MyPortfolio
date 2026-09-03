import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import ProjectForm from "./pages/admin/ProjectForm";
import ProfileAdmin from "./pages/admin/ProfileAdmin";
import PaymentProofsAdmin from "./pages/admin/PaymentProofsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ProjectPreview from "./pages/admin/ProjectPreview";

export default function App() {
  return (
    <Routes>
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
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="payment-proofs" element={<PaymentProofsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
