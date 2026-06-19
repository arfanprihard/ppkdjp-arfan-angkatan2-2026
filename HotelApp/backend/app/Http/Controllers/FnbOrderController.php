<?php

namespace App\Http\Controllers;

use App\Models\FnbOrder;
use App\Models\FnbOrderItem;
use App\Models\CheckIn;
use App\Models\GuestFolio;
use App\Models\FolioCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FnbOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = FnbOrder::with(['guest', 'room', 'items']);

        if ($request->has('outlet')) {
            $query->where('outlet', $request->outlet);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ], 200);
    }

    /**
     * Membuat Order F&B baru (termasuk item detailnya).
     */
    public function store(Request $request)
    {
        $request->validate([
            'outlet' => 'required|in:resto,room_service',
            'guest_id' => 'nullable|exists:guests,id',
            'room_id' => 'nullable|exists:rooms,id',
            'charge_to' => 'required|in:room,cash,card',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {

            // 1. Hitung Subtotal, Pajak (10%), dan Total
            $subtotal = 0;
            foreach ($request->items as $item) {
                $subtotal += $item['unit_price'] * $item['quantity'];
            }
            $tax = $subtotal * 0.1; // Pajak Pb1 10%
            $total = $subtotal + $tax;

            // Generate nomor order unik
            $orderNumber = 'FNB-' . strtoupper(substr($request->outlet, 0, 2)) . '-' . Carbon::now()->format('YmdHis');

            // 2. Simpan data FnbOrder
            $order = FnbOrder::create([
                'order_number' => $orderNumber,
                'outlet' => $request->outlet,
                'guest_id' => $request->guest_id,
                'room_id' => $request->room_id,
                'charge_to' => $request->charge_to,
                'status' => 'proses',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => $request->notes,
                'created_by' => $request->user()->id
            ]);

            // 3. Simpan item detail
            foreach ($request->items as $item) {
                FnbOrderItem::create([
                    'order_id' => $order->id,
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['unit_price'] * $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // 4. Jika Pembayaran dibebankan ke kamar, masukkan ke Folio Tagihan
            if ($request->charge_to === 'room') {
                if (!$request->room_id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Harap sertakan ID kamar untuk membebankan tagihan ke kamar.'
                    ], 400);
                }

                $checkIn = CheckIn::where('room_id', $request->room_id)
                    ->whereHas('reservation', function($q) {
                        $q->where('status', 'checked_in');
                    })->first();

                if (!$checkIn) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Kamar tidak memiliki check-in aktif untuk pembebanan biaya.'
                    ], 400);
                }

                $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();
                if (!$folio) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Guest Folio tidak ditemukan atau sudah ditutup untuk kamar ini.'
                    ], 400);
                }

                FolioCharge::create([
                    'folio_id' => $folio->id,
                    'charge_type' => 'fnb',
                    'description' => 'F&B Order (' . ucfirst($request->outlet) . ') - #' . $order->order_number,
                    'amount' => $total,
                    'quantity' => 1,
                    'charge_date' => Carbon::today(),
                    'reference_id' => $order->id,
                    'reference_type' => FnbOrder::class,
                    'created_by' => $request->user()->id,
                ]);

                $folio->increment('total_charges', $total);
                $folio->refresh();
                $folio->update([
                    'balance' => $folio->total_charges - $folio->total_payments
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pesanan F&B berhasil dicatat.',
                'data' => FnbOrder::with('items')->find($order->id)
            ], 201);
        });
    }

    /**
     * Update status order (proses -> selesai).
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:proses,selesai'
        ]);

        $order = FnbOrder::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan F&B tidak ditemukan.'
            ], 404);
        }

        // Batasi perubahan status agar hanya bisa maju (proses -> selesai)
        if ($order->status === 'selesai' && $request->status === 'proses') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan yang sudah selesai tidak dapat diubah kembali ke status proses.'
            ], 400);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status Pesanan F&B berhasil diupdate.',
            'data' => $order
        ], 200);
    }
}
