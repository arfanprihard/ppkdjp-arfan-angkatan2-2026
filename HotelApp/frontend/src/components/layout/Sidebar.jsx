import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
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
import ppkdLogo from "../../assets/ppkd_logo.png";


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const location = useLocation();
  const { user } = useAuth();

  const userRole = user?.role || "staff";
  const [hkTaskCount, setHkTaskCount] = useState(0);
  const [fnbOrderCount, setFnbOrderCount] = useState(0);

  useEffect(() => {
    if (userRole === "admin" || userRole === "housekeeping") {
      const fetchHkCount = async () => {
        try {
          const res = await api.get("/api/housekeeping/tasks");
          if (res.data.success) {
            const activeTasksCount = res.data.data.filter(
              (t) => t.status === "pending" || t.status === "in_progress"
            ).length;
            setHkTaskCount(activeTasksCount);
          }
        } catch (err) {
          console.error("Gagal mengambil count tugas HK", err);
        }
      };

      fetchHkCount();
      const interval = setInterval(fetchHkCount, 30000);
      return () => clearInterval(interval);
    } else {
      setHkTaskCount(0);
    }
  }, [userRole, location.pathname]);

  useEffect(() => {
    if (userRole === "admin" || userRole === "fnb" || userRole === "receptionist") {
      const fetchFnbCount = async () => {
        try {
          const res = await api.get("/api/fnb/orders?status=proses");
          if (res.data.success) {
            setFnbOrderCount(res.data.data.length);
          }
        } catch (err) {
          console.error("Gagal mengambil count order F&B", err);
        }
      };

      fetchFnbCount();
      const interval = setInterval(fetchFnbCount, 30000);
      return () => clearInterval(interval);
    } else {
      setFnbOrderCount(0);
    }
  }, [userRole, location.pathname]);

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
      className={`bg-white text-zinc-650 border-r border-zinc-200 sticky top-0 h-screen flex-col transition-all duration-300 ease-in-out relative ${isCollapsed ? "w-[72px]" : "w-64"
        } hidden md:flex`}
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-7 w-7 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-zinc-200">
            <img src={ppkdLogo} alt="Logo" className="h-7 w-7 object-contain" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
          >
            <span className="font-bold text-lg tracking-tight text-zinc-900 whitespace-nowrap">
              Hotel Syariah
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${isActive
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
                className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${isActive
                  ? "text-blue-600"
                  : "text-zinc-400 group-hover:text-zinc-600"
                  }`}
              />
              <span
                className={`truncate whitespace-nowrap transition-all duration-300 ${isCollapsed ? "hidden" : "block"
                  }`}
              >
                {item.label}
              </span>

              {item.path === "/housekeeping" && hkTaskCount > 0 && (
                <span className={`absolute ${isCollapsed ? "top-1.5 right-1.5" : "right-3 top-1/2 -translate-y-1/2"} flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-extrabold text-white ${isCollapsed ? "" : "animate-pulse"}`}>
                  {hkTaskCount}
                </span>
              )}

              {item.path === "/fnb" && fnbOrderCount > 0 && (
                <span className={`absolute ${isCollapsed ? "top-1.5 right-1.5" : "right-3 top-1/2 -translate-y-1/2"} flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-extrabold text-white ${isCollapsed ? "" : "animate-pulse"}`}>
                  {fnbOrderCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div className="border-t border-zinc-200 p-3">
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 border border-zinc-200/60 ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
              {user.name?.charAt(0) || "?"}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 min-w-0 ${isCollapsed ? "hidden" : "block"
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
