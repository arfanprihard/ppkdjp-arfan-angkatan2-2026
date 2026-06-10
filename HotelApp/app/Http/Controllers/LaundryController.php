<?php

namespace App\Http\Controllers;

use App\Models\LaundryRequest;
use App\Models\GuestFolio;
use App\Models\FolioCharge;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LaundryController extends Controller
{
    public function index()
    {
        $laundries = LaundryRequest::with(['guest', 'room', 'staff'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $laundries
        ], 200);
    }

    /**
     * Membuat request laundry baru dan otomatis memasukkan tagihan ke folio kamar tamu.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'room_id' => 'required|exists:rooms,id',
            'items_description' => 'required|string',
            'item_count' => 'required|integer|min:1',
            'total_charge' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Buat Laundry Request
            $laundry = LaundryRequest::create(array_merge($request->all(), [
                'status' => 'received',
                'received_at' => Carbon::now()
            ]));

            // 2. Cari Folio Kamar Tamu yang sedang aktif (open)
            $checkIn = CheckIn::where('room_id', $request->room_id)
                ->whereHas('reservation', function($q) {
                    $q->where('status', 'checked_in');
                })->first();

            if ($checkIn) {
                $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();

                if ($folio) {
                    // 3. Masukkan biaya laundry ke Folio
                    FolioCharge::create([
                        'folio_id' => $folio->id,
                        'charge_type' => 'laundry',
                        'description' => 'Layanan Laundry - ' . $request->item_count . ' Pcs (' . $request->items_description . ')',
                        'amount' => $request->total_charge,
                        'quantity' => 1,
                        'charge_date' => Carbon::today(),
                        'reference_id' => $laundry->id,
                        'reference_type' => LaundryRequest::class,
                        'created_by' => $request->user()->id,
                    ]);

                    // Update saldo folio
                    $folio->increment('total_charges', $request->total_charge);
                    $folio->update([
                        'balance' => $folio->total_charges - $folio->total_payments
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Layanan Laundry berhasil dicatat dan dibebankan ke kamar.',
                'data' => $laundry
            ], 201);
        });
    }

    /**
     * Update status laundry (received -> processing -> done -> delivered).
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:received,processing,done,delivered'
        ]);

        $laundry = LaundryRequest::find($id);

        if (!$laundry) {
            return response()->json([
                'success' => false,
                'message' => 'Data Laundry tidak ditemukan.'
            ], 404);
        }

        $laundry->status = $request->status;

        if ($request->status === 'delivered') {
            $laundry->delivered_at = Carbon::now();
        }

        $laundry->save();

        return response()->json([
            'success' => true,
            'message' => 'Status Laundry berhasil diupdate.',
            'data' => $laundry
        ], 200);
    }
}
