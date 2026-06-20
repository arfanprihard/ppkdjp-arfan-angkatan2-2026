import { ClipboardList, RefreshCw, Clock, MapPin, User, AlertTriangle, Check, Truck } from "lucide-react";

const OUTLETS = {
  resto: { label: "Restoran", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  room_service: { label: "Room Service", color: "bg-blue-50 text-blue-700 border-blue-200" }
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
  // Filter active orders with status 'proses' or 'pengiriman'
  const kitchenOrders = orders.filter((o) => o.status === "proses" || o.status === "pengiriman");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          Antrean Masak & Penyiapan Dapur
        </h3>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors border-0 bg-transparent"
          title="Refresh Antrean"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-xs">Memuat antrean dapur...</p>
        </div>
      ) : kitchenOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden transition-all duration-300 animate-in fade-in"
            >
              {/* Glowing header line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black text-blue-600">#{order.order_number}</h4>
                    <span className="text-[10px] text-zinc-550 flex items-center gap-1.5 mt-0.5 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(order.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${OUTLETS[order.outlet]?.color || "bg-zinc-100 text-zinc-650 border-zinc-200"}`}>
                    {OUTLETS[order.outlet]?.label || order.outlet}
                  </span>
                </div>

                {/* Room & Guest Info */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-zinc-150">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Kamar</span>
                    <span className="text-zinc-800 font-bold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      {order.room ? `Kamar ${order.room.room_number}` : "Walk-in"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Tamu</span>
                    <span className="text-zinc-800 font-bold truncate flex items-center gap-1" title={order.guest?.name || "Tamu Luar"}>
                      <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
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
                        <span className="text-zinc-700 font-medium leading-tight">
                          {item.item_name} <span className="text-blue-600 font-extrabold ml-1">x{item.quantity}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooking Notes */}
                {order.notes && (
                  <div className="text-xs bg-amber-50 border border-amber-200 p-2 rounded-xl text-amber-800 flex gap-2 items-start mt-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 block">Catatan Cook</span>
                      <p className="text-[11px] leading-tight italic text-zinc-700">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block leading-none">Total Harga</span>
                  <span className="font-extrabold text-zinc-800 block mt-0.5">{formatRupiah(order.total)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status badge */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    order.status === 'proses' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {order.status === 'proses' ? '🔥 Proses' : '🚚 Pengiriman'}
                  </span>

                  {order.status === 'proses' && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus = order.outlet === 'room_service' ? 'pengiriman' : 'selesai';
                        const label = order.outlet === 'room_service' ? 'Kirim ke Kamar' : 'Selesaikan Pesanan';
                        if (window.confirm(`Konfirmasi: ${label}?`)) {
                          onUpdateStatus(order.id, nextStatus);
                        }
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 border-0"
                    >
                      {order.outlet === 'room_service' ? (
                        <><Truck className="h-4 w-4" /> Kirim</>
                      ) : (
                        <><Check className="h-4 w-4" /> Selesaikan</>
                      )}
                    </button>
                  )}

                  {order.status === 'pengiriman' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Konfirmasi: Pesanan sudah diterima tamu?')) {
                          onUpdateStatus(order.id, 'selesai');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 border-0"
                    >
                      <Check className="h-4 w-4" /> Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-zinc-200 rounded-2xl bg-white shadow-xs">
          <ClipboardList className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-650 text-xs font-semibold">Antrean dapur bersih.</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Tidak ada pesanan aktif dengan status "Proses".</p>
        </div>
      )}
    </div>
  );
};

export default KitchenBoard;
