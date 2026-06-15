import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#090a0f] text-zinc-100 transition-colors duration-200">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar />

      {/* Konten Utama Kanan */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Bar Navigasi Atas */}
        <Topbar />

        {/* Panel Halaman / Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
