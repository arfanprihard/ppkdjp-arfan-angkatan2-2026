import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Content from "./components/layout/Content";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Komponen sementara (placeholder) agar halaman tidak crash saat diakses dari menu sidebar
const Placeholder = ({ name }) => (
  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
    <h2 className="text-lg font-bold text-zinc-800 dark:text-white">
      Modul {name}
    </h2>
    <p className="text-sm text-zinc-500 mt-1">
      Halaman ini sedang dalam tahap pengembangan.
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. Rute Publik (Halaman Login) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. Rute Terproteksi dengan Layout Dashboard */}

          {/* Rute Dashboard Overview (Semua staf yang login bisa masuk) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Content>
                  <DashboardPage />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Reservasi (Hanya Admin & Resepsionis) */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                <Content>
                  <Placeholder name="Reservasi Tamu" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Daftar Tamu (Hanya Admin & Resepsionis) */}
          <Route
            path="/guests"
            element={
              <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                <Content>
                  <Placeholder name="Daftar Tamu" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Status Kamar (Admin, Resepsionis, & Housekeeping) */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "receptionist", "housekeeping"]}
              >
                <Content>
                  <Placeholder name="Status Kamar" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Housekeeping & Laundry (Hanya Admin & Housekeeping) */}
          <Route
            path="/housekeeping"
            element={
              <ProtectedRoute allowedRoles={["admin", "housekeeping"]}>
                <Content>
                  <Placeholder name="Housekeeping & Laundry" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Layanan Food & Beverage (Admin, F&B Service, & Resepsionis) */}
          <Route
            path="/fnb"
            element={
              <ProtectedRoute allowedRoles={["admin", "fnb", "receptionist"]}>
                <Content>
                  <Placeholder name="Layanan Food & Beverage" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Rute Kelola Akun Staf (Hanya Admin) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Content>
                  <Placeholder name="Kelola Staf" />
                </Content>
              </ProtectedRoute>
            }
          />

          {/* Jika ada yang membuka URL selain di atas, otomatis alihkan ke Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
