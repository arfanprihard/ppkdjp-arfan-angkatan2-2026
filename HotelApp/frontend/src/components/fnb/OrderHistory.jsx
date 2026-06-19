import { History, RefreshCw } from "lucide-react";

const OUTLETS = {
  resto: { label: "Restoran", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  room_service: { label: "Room Service", color: "bg-blue-50 text-blue-700 border-blue-200" }
};

const PAYMENT_METHODS = {
  room: { label: "Charge ke Kamar", color: "bg-amber-50 text-amber-700 border-amber-200" },
  cash: { label: "Cash / Tunai", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  card: { label: "Kartu Debit/Kredit", color: "bg-purple-50 text-purple-700 border-purple-200" }
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
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <History className="h-4 w-4 text-blue-600" />
          Riwayat Pesanan F&B Selesai
        </h3>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors border-0 bg-transparent"
          title="Refresh Riwayat"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-xs">Memuat riwayat...</p>
        </div>
      ) : historyOrders.length > 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
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
              <tbody className="divide-y divide-zinc-200 text-xs text-zinc-700 font-medium">
                {historyOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-black text-zinc-900">#{order.order_number}</td>
                    <td className="px-5 py-4 text-zinc-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${OUTLETS[order.outlet]?.color || "bg-zinc-100 text-zinc-650 border-zinc-200"}`}>
                        {OUTLETS[order.outlet]?.label || order.outlet}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 max-w-[150px]">
                        <p className="font-bold text-zinc-900 truncate">{order.guest?.name || "Tamu Luar"}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {order.room ? `Kamar ${order.room.room_number}` : "Walk-in"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {order.items?.map((item) => (
                          <p key={item.id} className="leading-tight text-zinc-700">
                            {item.item_name} <span className="text-blue-600 font-bold text-[10px]">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${PAYMENT_METHODS[order.charge_to]?.color || "bg-zinc-100 text-zinc-650 border-zinc-200"}`}>
                        {PAYMENT_METHODS[order.charge_to]?.label || order.charge_to}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-zinc-800 whitespace-nowrap">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-250">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
        <div className="py-20 text-center border border-dashed border-zinc-200 rounded-2xl bg-white shadow-xs">
          <History className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-650 text-xs font-semibold">Riwayat pesanan kosong.</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Belum ada pesanan F&B yang diselesaikan hari ini.</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
