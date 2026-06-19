import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Bed,
  ClipboardList,
  Utensils,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Hotel,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const location = useLocation();
  const { user } = useAuth();

  const userRole = user?.role || "staff";

  // Daftar menu lengkap dengan batasan role-nya (sesuai PRD)
  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "receptionist", "housekeeping", "fnb"],
    },
    {
      path: "/reservations",
      label: "Reservasi",
      icon: CalendarRange,
      roles: ["admin", "receptionist"],
    },
    {
      path: "/guests",
      label: "Daftar Tamu",
      icon: Users,
      roles: ["admin", "receptionist"],
    },
    {
      path: "/rooms",
      label: "Status Kamar",
      icon: Bed,
      roles: ["admin", "receptionist", "housekeeping"],
    },
    {
      path: "/housekeeping",
      label: "Housekeeping",
      icon: ClipboardList,
      roles: ["admin", "housekeeping"],
    },
    {
      path: "/fnb",
      label: "Layanan F&B",
      icon: Utensils,
      roles: ["admin", "fnb", "receptionist"],
    },
    {
      path: "/users",
      label: "Kelola Staf",
      icon: ShieldAlert,
      roles: ["admin"],
    },
  ];

  // Saring menu yang hanya boleh diakses oleh role staf aktif
  const allowedMenu = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`bg-white text-zinc-600 border-r border-zinc-200 min-h-screen flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
            <Hotel className="h-5 w-5" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <span className="font-bold text-lg tracking-tight text-zinc-900 whitespace-nowrap">
              HotelOps
            </span>
          </div>
        </div>
      </div>

      {/* Menu Label */}
      <div className="px-5 pt-6 pb-2">
        {!isCollapsed && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Menu Utama
          </p>
        )}
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {allowedMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-zinc-600 hover:bg-slate-50 hover:text-zinc-950"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-r-full" />
              )}
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600"
                    : "text-zinc-400 group-hover:text-zinc-600"
                }`}
              />
              <span
                className={`truncate whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "hidden" : "block"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div className="border-t border-zinc-200 p-3">
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 border border-zinc-200/60 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
              {user.name?.charAt(0) || "?"}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 min-w-0 ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              <p className="text-xs font-semibold text-zinc-800 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-zinc-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle Button */}
      <button
        onClick={() => {
          const nextState = !isCollapsed;
          setIsCollapsed(nextState);
          localStorage.setItem("sidebar_collapsed", String(nextState));
        }}
        className="absolute top-[18px] -right-3 h-6 w-6 rounded-full bg-white border border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
