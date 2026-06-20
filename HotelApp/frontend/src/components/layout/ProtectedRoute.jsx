import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading spinner saat sedang cek sesi ke server
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 1. Belum login → redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Sudah login tapi role tidak punya akses → redirect ke dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Aman, tampilkan halaman
  return children;
};

export default ProtectedRoute;
