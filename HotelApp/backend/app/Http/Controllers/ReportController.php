<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\FolioCharge;
use App\Models\CheckIn;
use App\Models\CheckOut;
use App\Models\HousekeepingTask;
use App\Models\FnbOrder;
use App\Models\Reservation;
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

    /**
     * Laporan Harian Resepsionis (Front Office).
     */
    public function receptionistDailyReport()
    {
        $today = Carbon::today()->toDateString();

        $checkInsToday = CheckIn::with(['reservation.guest', 'room'])
            ->whereDate('check_in_time', $today)
            ->get();

        $checkOutsToday = CheckOut::with(['checkIn.reservation.guest', 'checkIn.room'])
            ->whereDate('check_out_time', $today)
            ->get();

        $reservationsCreatedToday = Reservation::with(['guest', 'roomType'])
            ->whereDate('created_at', $today)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $today,
                'summary' => [
                    'total_check_ins' => $checkInsToday->count(),
                    'total_check_outs' => $checkOutsToday->count(),
                    'total_reservations_created' => $reservationsCreatedToday->count(),
                ],
                'check_ins' => $checkInsToday,
                'check_outs' => $checkOutsToday,
                'reservations_created' => $reservationsCreatedToday
            ]
        ], 200);
    }

    /**
     * Laporan Harian Housekeeping.
     */
    public function housekeepingDailyReport()
    {
        $today = Carbon::today()->toDateString();

        $tasksToday = HousekeepingTask::with(['room', 'assignedStaff'])
            ->whereDate('created_at', $today)
            ->get();

        $statusCounts = HousekeepingTask::whereDate('created_at', $today)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses have a count
        $summary = [
            'pending' => $statusCounts['pending'] ?? 0,
            'in_progress' => $statusCounts['in_progress'] ?? 0,
            'completed' => $statusCounts['completed'] ?? 0,
            'cancelled' => $statusCounts['cancelled'] ?? 0,
            'total_tasks' => $tasksToday->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $today,
                'summary' => $summary,
                'tasks' => $tasksToday
            ]
        ], 200);
    }

    /**
     * Laporan Harian Food & Beverage.
     */
    public function fnbDailyReport()
    {
        $today = Carbon::today()->toDateString();

        $ordersToday = FnbOrder::with(['room', 'guest', 'items'])
            ->whereDate('created_at', $today)
            ->get();

        $totalRevenue = FnbOrder::whereDate('created_at', $today)
            ->where('status', 'selesai')
            ->sum('total');

        $statusCounts = FnbOrder::whereDate('created_at', $today)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $outletCounts = FnbOrder::whereDate('created_at', $today)
            ->select('outlet', DB::raw('count(*) as count'))
            ->groupBy('outlet')
            ->pluck('count', 'outlet')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $today,
                'summary' => [
                    'total_orders' => $ordersToday->count(),
                    'total_revenue' => floatval($totalRevenue),
                    'status_counts' => [
                        'proses' => $statusCounts['proses'] ?? 0,
                        'pengiriman' => $statusCounts['pengiriman'] ?? 0,
                        'selesai' => $statusCounts['selesai'] ?? 0,
                    ],
                    'outlet_counts' => [
                        'resto' => $outletCounts['resto'] ?? 0,
                        'room_service' => $outletCounts['room_service'] ?? 0,
                    ]
                ],
                'orders' => $ordersToday
            ]
        ], 200);
    }
}

