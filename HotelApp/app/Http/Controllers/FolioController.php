<?php

namespace App\Http\Controllers;

use App\Models\GuestFolio;
use App\Models\FolioCharge;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FolioController extends Controller
{
    /**
     * Mendapatkan data Folio berdasarkan check_in_id beserta rincian tagihannya.
     */
    public function show(int $checkInId)
    {
        $folio = GuestFolio::with(['guest', 'checkIn.room', 'charges.creator'])
            ->where('check_in_id', $checkInId)
            ->first();

        if (!$folio) {
            return response()->json([
                'success' => false,
                'message' => 'Folio tagihan tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $folio
        ], 200);
    }

    /**
     * Menambahkan Charge baru secara manual ke Folio (Extra Bed, Minibar, dll).
     */
    public function addCharge(Request $request, int $id)
    {
        $request->validate([
            'charge_type' => 'required|in:room,fnb,laundry,minibar,extra_bed,other',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ]);

        $folio = GuestFolio::find($id);

        if (!$folio || $folio->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Folio tidak ditemukan atau sudah ditutup.'
            ], 400);
        }

        $totalCharge = $request->amount * $request->quantity;

        // Buat record charge
        $charge = FolioCharge::create([
            'folio_id' => $folio->id,
            'charge_type' => $request->charge_type,
            'description' => $request->description,
            'amount' => $totalCharge,
            'quantity' => $request->quantity,
            'charge_date' => Carbon::today(),
            'created_by' => $request->user()->id,
        ]);

        // Rekalkulasi Folio
        $folio->increment('total_charges', $totalCharge);
        $folio->update([
            'balance' => $folio->total_charges - $folio->total_payments
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Charge berhasil ditambahkan ke Folio.',
            'data' => $charge
        ], 201);
    }

    /**
     * Pembayaran cicilan / pelunasan sementara di tengah masa inap (Settle/Payment).
     */
    public function settle(Request $request, int $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,credit_card,debit,transfer'
        ]);

        $folio = GuestFolio::find($id);

        if (!$folio || $folio->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Folio tidak ditemukan atau sudah ditutup.'
            ], 400);
        }

        // Catat pembayaran
        $folio->increment('total_payments', $request->amount);
        $folio->update([
            'balance' => $folio->total_charges - $folio->total_payments
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran sebesar Rp' . number_format($request->amount, 0, ',', '.') . ' berhasil dicatat.',
            'data' => $folio
        ], 200);
    }
}
