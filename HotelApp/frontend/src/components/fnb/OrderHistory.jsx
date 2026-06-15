import { History, RefreshCw } from "lucide-react";

const OUTLETS = {
  resto: { label: "Restoran", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  room_service: { label: "Room Service", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
};

const PAYMENT_METHODS = {
  room: { label: "Charge ke Kamar", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  cash: { label: "Cash / Tunai", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  card: { label: "Kartu Debit/Kredit", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" }
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const OrderHistory = ({
  orders,
  loading,
  onRefresh,
}) => {
  // Filter history orders with status 'selesai'
  const historyOrders = orders.filter((o) => o.status === "selesai");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-400" />
          Riwayat Pesanan F&B Selesai
        </h3>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors border-0 bg-transparent"
          title="Refresh Riwayat"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-xs">Memuat riwayat...</p>
        </div>
      ) : historyOrders.length > 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                  <th className="px-5 py-3.5">No. Order</th>
                  <th className="px-5 py-3.5">Tanggal & Waktu</th>
                  <th className="px-5 py-3.5">Outlet</th>
                  <th className="px-5 py-3.5">Kamar / Tamu</th>
                  <th className="px-5 py-3.5">Menu Dipesan</th>
                  <th className="px-5 py-3.5">Metode Bayar</th>
                  <th className="px-5 py-3.5 text-right">Total</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs text-zinc-300">
                {historyOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-4 font-black text-zinc-200">#{order.order_number}</td>
                    <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${OUTLETS[order.outlet]?.color || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                        {OUTLETS[order.outlet]?.label || order.outlet}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 max-w-[150px]">
                        <p className="font-bold text-zinc-200 truncate">{order.guest?.name || "Tamu Luar"}</p>
                        <p className="text-[10px] text-zinc-400">
                          {order.room ? `Kamar ${order.room.room_number}` : "Walk-in"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {order.items?.map((item) => (
                          <p key={item.id} className="leading-tight">
                            {item.item_name} <span className="text-zinc-500 font-semibold text-[10px]">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${PAYMENT_METHODS[order.charge_to]?.color || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                        {PAYMENT_METHODS[order.charge_to]?.label || order.charge_to}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-zinc-100 whitespace-nowrap">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
          <History className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs">Riwayat pesanan kosong.</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Belum ada pesanan F&B yang diselesaikan hari ini.</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
