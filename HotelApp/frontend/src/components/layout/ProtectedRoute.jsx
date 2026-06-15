import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading spinner saat sedang cek sesi ke server
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#090a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-zinc-800 border-t-white rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
            Memverifikasi sesi...
          </p>
        </div>
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
