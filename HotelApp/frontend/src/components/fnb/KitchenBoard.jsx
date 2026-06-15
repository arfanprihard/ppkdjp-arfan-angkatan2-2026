import { ClipboardList, RefreshCw, Clock, MapPin, User, AlertTriangle, Check } from "lucide-react";

const OUTLETS = {
  resto: { label: "Restoran", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  room_service: { label: "Room Service", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const KitchenBoard = ({
  orders,
  loading,
  onRefresh,
  onUpdateStatus,
}) => {
  // Filter active orders with status 'proses'
  const kitchenOrders = orders.filter((o) => o.status === "proses");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-amber-500" />
          Antrean Masak & Penyiapan Dapur
        </h3>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors border-0 bg-transparent"
          title="Refresh Antrean"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-xs">Memuat antrean dapur...</p>
        </div>
      ) : kitchenOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden transition-all duration-300 animate-in fade-in"
            >
              {/* Glowing header line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black text-amber-400">#{order.order_number}</h4>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${OUTLETS[order.outlet]?.color || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                    {OUTLETS[order.outlet]?.label || order.outlet}
                  </span>
                </div>

                {/* Room & Guest Info */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/45 p-2 rounded-xl border border-zinc-800/60">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Kamar</span>
                    <span className="text-zinc-200 font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      {order.room ? `Kamar ${order.room.room_number}` : "Walk-in"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Tamu</span>
                    <span className="text-zinc-200 font-semibold truncate flex items-center gap-1" title={order.guest?.name || "Tamu Luar"}>
                      <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      {order.guest?.name || "Tamu Luar"}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 pt-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Items Pesanan</span>
                  <div className="space-y-1.5">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-xs">
                        <span className="text-zinc-300 font-medium leading-tight">
                          {item.item_name} <span className="text-amber-400/90 font-bold ml-1">x{item.quantity}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooking Notes */}
                {order.notes && (
                  <div className="text-xs bg-rose-500/5 border border-rose-500/10 p-2 rounded-xl text-rose-300/90 flex gap-2 items-start mt-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 block">Catatan Cook</span>
                      <p className="text-[11px] leading-tight italic">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block leading-none">Total Harga</span>
                  <span className="font-extrabold text-zinc-200 block mt-0.5">{formatRupiah(order.total)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, "selesai")}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/10 cursor-pointer flex items-center gap-1.5 border-0"
                >
                  <Check className="h-4 w-4" />
                  Selesaikan Pesanan
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
          <ClipboardList className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
          <p className="text-zinc-400 text-xs font-medium">Antrean dapur bersih.</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Tidak ada pesanan aktif dengan status "Proses".</p>
        </div>
      )}
    </div>
  );
};

export default KitchenBoard;
