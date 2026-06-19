import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User, Bell } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Menentukan judul halaman dinamis berdasarkan rute url
  const getPageTitle = () => {
    const pathMap = {
      "/dashboard": "Dashboard Overview",
      "/reservations": "Reservasi Tamu",
      "/guests": "Daftar Tamu",
      "/rooms": "Status Kamar (Room Board)",
      "/housekeeping": "Housekeeping & Laundry",
      "/fnb": "Layanan Food & Beverage",
      "/users": "Manajemen Akun Staf",
    };
    return pathMap[location.pathname] || "HotelOps System";
  };

  // Subtitle per halaman
  const getPageSubtitle = () => {
    const subtitleMap = {
      "/dashboard": "Ringkasan aktivitas hotel hari ini",
      "/reservations": "Kelola pemesanan kamar tamu",
      "/guests": "Data tamu yang menginap & riwayat",
      "/rooms": "Pantau ketersediaan & status kamar",
      "/housekeeping": "Tugas kebersihan & laundry",
      "/fnb": "Pesanan makanan & minuman tamu",
      "/users": "Kelola akun & hak akses staf",
    };
    return subtitleMap[location.pathname] || "";
  };

  // Badge warna berdasarkan role
  // Badge warna berdasarkan role (Light Theme)
  const getRoleBadgeClass = (role) => {
    const badges = {
      admin: "bg-rose-50 text-rose-600 border-rose-200",
      receptionist: "bg-blue-50 text-blue-600 border-blue-200",
      housekeeping: "bg-emerald-50 text-emerald-600 border-emerald-200",
      fnb: "bg-amber-50 text-amber-600 border-amber-200",
    };
    return (
      badges[role?.toLowerCase()] ||
      "bg-zinc-50 text-zinc-500 border-zinc-200"
    );
  };

  const handleLogout = async () => {
    await logout(); // Panggil API logout + bersihkan state
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between select-none sticky top-0 z-10">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-bold text-[15px] text-zinc-900 tracking-tight leading-tight">
          {getPageTitle()}
        </h1>
        {getPageSubtitle() && (
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {getPageSubtitle()}
          </p>
        )}
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell (placeholder) */}
        <button
          className="p-2 rounded-lg hover:bg-slate-50 text-zinc-500 transition-colors duration-200 relative cursor-pointer border-0 bg-transparent"
          title="Notifikasi"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-600 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-200 mx-1" />

        {/* User Info Card */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors duration-200">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[13px] font-semibold text-zinc-800 leading-tight">
              {user?.name || "Staff"}
            </p>
            <span
              className={`inline-block text-[9px] font-bold uppercase px-1.5 py-px rounded border mt-0.5 ${getRoleBadgeClass(user?.role)}`}
            >
              {user?.role || "staff"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-rose-50 text-zinc-500 hover:text-rose-600 cursor-pointer transition-all duration-200 border-0 bg-transparent"
          title="Logout"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;