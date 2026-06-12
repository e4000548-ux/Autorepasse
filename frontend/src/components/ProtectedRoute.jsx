import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, role, roles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-zinc-500">Carregando…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  // Accept either a single `role` (string) or `roles` (array). Empty/undefined = any logged-in user.
  const allowed = roles ?? (role ? [role] : null);
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
