<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\FolioCharge;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Laporan Tingkat Hunian (Occupancy Rate) dalam 7 hari terakhir.
     */
    public function occupancy()
    {
        $data = [];
        $totalRooms = Room::count();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->toDateString();

            // Hitung kamar yang occupied pada tanggal tersebut berdasarkan reservasi aktif
            $occupiedCount = \App\Models\Reservation::whereNotIn('status', ['cancelled', 'no_show'])
                ->where('check_in_date', '<=', $date)
                ->where('check_out_date', '>', $date)
                ->count();
            
            $rate = $totalRooms > 0 ? round(($occupiedCount / $totalRooms) * 100, 1) : 0;
            if ($rate > 100) {
                $rate = 100;
            }

            $data[] = [
                'date' => $date,
                'occupied_rooms' => min($occupiedCount, $totalRooms),
                'occupancy_rate' => $rate
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Laporan Pendapatan (Revenue Breakdown) berdasarkan kategori tagihan.
     */
    public function revenue()
    {
        $revenue = FolioCharge::select('charge_type', DB::raw('SUM(amount) as total'))
            ->groupBy('charge_type')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $revenue
        ], 200);
    }
}
