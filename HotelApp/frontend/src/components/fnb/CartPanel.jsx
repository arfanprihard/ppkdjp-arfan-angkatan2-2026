import { ShoppingBag, Minus, Plus, Trash2, RefreshCw, Check } from "lucide-react";

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

const CartPanel = ({
  cart,
  updateCartQty,
  removeFromCart,
  clearCart,
  outlet,
  setOutlet,
  selectedReservationId,
  onRoomSelection,
  guestName,
  chargeTo,
  setChargeTo,
  notes,
  setNotes,
  activeCheckins,
  submittingOrder,
  onSubmitOrder,
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-600" />
          Keranjang Pesanan
        </h3>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 cursor-pointer border-0 bg-transparent"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Cart Items List */}
      {cart.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-200 bg-slate-50/50"
            >
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-zinc-800 truncate">{item.name}</h5>
                <span className="text-[10px] font-medium text-zinc-550">
                  {formatRupiah(item.price)}
                </span>
              </div>
              
              {/* Qty Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQty(item.id, -1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-zinc-650 hover:text-zinc-900 cursor-pointer border-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-bold text-zinc-800 w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQty(item.id, 1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-zinc-650 hover:text-zinc-900 cursor-pointer border-0"
                >
                  <Plus className="h-3 w-3" />
                </button>
                
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 ml-1 cursor-pointer transition-colors border-0 bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded-xl bg-slate-50/50">
          <p className="text-[11px] text-zinc-500 font-medium">Keranjang belanja Anda masih kosong.</p>
          <p className="text-[9px] text-zinc-400 mt-0.5">Pilih menu di sebelah kiri untuk menambahkan.</p>
        </div>
      )}

      {/* Billing Details & Settings Form */}
      <form onSubmit={onSubmitOrder} className="space-y-4 border-t border-zinc-200 pt-4">
        <div className="space-y-3">
          {/* Outlet */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 block">Outlet F&B *</label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
            >
              <option value="resto">Restoran</option>
              <option value="room_service">Room Service (Kamar)</option>
            </select>
          </div>

          {/* Kamar & Tamu (Hanya jika room_service) */}
          {outlet === "room_service" && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 block">Pilih Kamar Tamu *</label>
                <select
                  required
                  value={selectedReservationId}
                  onChange={(e) => onRoomSelection(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
                >
                  <option value="">-- Pilih Kamar --</option>
                  {activeCheckins.map((resv) => (
                    <option key={resv.id} value={resv.id}>
                      Kamar {resv.room?.room_number} (Tamu: {resv.guest?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 block">Nama Tamu</label>
                <input
                  type="text"
                  disabled
                  value={guestName}
                  placeholder="Otomatis terisi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 outline-none"
                />
              </div>
            </>
          )}

          {/* Metode Pembayaran */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 block">Metode Pembayaran *</label>
            <select
              value={chargeTo}
              onChange={(e) => setChargeTo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
            >
              {outlet === "room_service" && (
                <option value="room">Charge ke Kamar (Room Folio)</option>
              )}
              <option value="cash">Cash / Tunai</option>
              <option value="card">Kartu Kredit/Debit</option>
            </select>
          </div>

          {/* Catatan Memasak */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 block">Catatan Pesanan</label>
            <textarea
              rows={2}
              placeholder="Contoh: Nasi goreng pedas, es teh tanpa es..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
            />
          </div>
        </div>

        {/* Subtotal, Pajak, Total */}
        <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-500 font-medium">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500 font-medium">
            <span>Pajak Resto (10%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between text-zinc-800 font-bold text-sm pt-1 border-t border-zinc-150">
            <span>Total Tagihan</span>
            <span className="text-blue-600">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submittingOrder || cart.length === 0}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border-0"
        >
          {submittingOrder ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Catat Pesanan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CartPanel;
