import { ShoppingBag, Minus, Plus, Trash2, RefreshCw, Check } from "lucide-react";

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
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-amber-500" />
          Keranjang Pesanan
        </h3>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-350 cursor-pointer border-0 bg-transparent"
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
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/30"
            >
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-zinc-200 truncate">{item.name}</h5>
                <span className="text-[10px] font-medium text-zinc-500">
                  {formatRupiah(item.price)}
                </span>
              </div>
              
              {/* Qty Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQty(item.id, -1)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer border-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-bold text-white w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQty(item.id, 1)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer border-0"
                >
                  <Plus className="h-3 w-3" />
                </button>
                
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 ml-1 cursor-pointer transition-colors border-0 bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10">
          <p className="text-[11px] text-zinc-400">Keranjang belanja Anda masih kosong.</p>
          <p className="text-[9px] text-zinc-600 mt-0.5">Pilih menu di sebelah kiri untuk menambahkan.</p>
        </div>
      )}

      {/* Billing Details & Settings Form */}
      <form onSubmit={onSubmitOrder} className="space-y-4 border-t border-zinc-800 pt-4">
        <div className="space-y-3">
          {/* Outlet */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 font-bold block">Outlet F&B *</label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
            >
              <option value="resto">Restoran</option>
              <option value="room_service">Room Service (Kamar)</option>
            </select>
          </div>

          {/* Kamar & Tamu (Hanya jika room_service) */}
          {outlet === "room_service" && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 font-bold block">Pilih Kamar Tamu *</label>
                <select
                  required
                  value={selectedReservationId}
                  onChange={(e) => onRoomSelection(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
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
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 font-bold block">Nama Tamu</label>
                <input
                  type="text"
                  disabled
                  value={guestName}
                  placeholder="Otomatis terisi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400 outline-none"
                />
              </div>
            </>
          )}

          {/* Metode Pembayaran */}
          <div className="space-y-1">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 font-bold block">Metode Pembayaran *</label>
            <select
              value={chargeTo}
              onChange={(e) => setChargeTo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
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
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 font-bold block">Catatan Pesanan</label>
            <textarea
              rows={2}
              placeholder="Contoh: Nasi goreng pedas, es teh tanpa es..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-amber-500/40 resize-none"
            />
          </div>
        </div>

        {/* Subtotal, Pajak, Total */}
        <div className="border-t border-zinc-800 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Pajak Resto (10%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-zinc-800/50">
            <span>Total Tagihan</span>
            <span className="text-amber-400">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submittingOrder || cart.length === 0}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border-0"
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
