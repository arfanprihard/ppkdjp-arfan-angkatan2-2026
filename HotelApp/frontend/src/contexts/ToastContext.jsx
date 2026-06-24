import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider");
  }
  return context;
};

// Konfigurasi ikon & warna per tipe toast
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-800",
    progressColor: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
    textColor: "text-rose-800",
    progressColor: "bg-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    textColor: "text-amber-800",
    progressColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    textColor: "text-blue-800",
    progressColor: "bg-blue-500",
  },
};

// Komponen Toast Item
const ToastItem = ({ toast, onDismiss }) => {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${config.bg} animate-slide-in-right overflow-hidden min-w-[320px] max-w-[420px]`}
      role="alert"
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-bold ${config.textColor} leading-tight`}>
            {toast.title}
          </p>
        )}
        <p
          className={`text-[13px] ${config.textColor} opacity-80 leading-snug ${toast.title ? "mt-0.5" : ""}`}
        >
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 mt-0.5 p-0.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
      >
        <X className={`h-3.5 w-3.5 ${config.textColor} opacity-50`} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/5">
        <div
          className={`h-full ${config.progressColor} opacity-40`}
          style={{
            animation: `shrink ${toast.duration || 4000}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

// Provider
let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, message, options = {}) => {
      const id = ++toastIdCounter;
      const duration = options.duration || 4000;
      const newToast = {
        id,
        type,
        message,
        title: options.title || null,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss
      timersRef.current[id] = setTimeout(() => {
        dismiss(id);
      }, duration);

      return id;
    },
    [dismiss]
  );

  // Helper shortcut methods
  const toast = useCallback(
    {
      success: (msg, opts) => addToast("success", msg, opts),
      error: (msg, opts) => addToast("error", msg, opts),
      warning: (msg, opts) => addToast("warning", msg, opts),
      info: (msg, opts) => addToast("info", msg, opts),
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container — Fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      {/* Global keyframe for progress bar and slide animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastContext;
