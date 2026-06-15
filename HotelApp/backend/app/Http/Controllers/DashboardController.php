<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Reservation;
use App\Models\HousekeepingTask;
use App\Models\FnbOrder;
use App\Models\FolioCharge;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $role = $request->user()->role;
        $today = Carbon::today()->toDateString();

        switch ($role) {
            case 'admin':
                // Total Kamar, Occupied %, Pendapatan hari ini, Reservasi baru hari ini
                $totalRooms = Room::count();
                $occupiedRooms = Room::whereIn('status', ['oc', 'od'])->count();
                $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

                $revenueToday = FolioCharge::whereDate('charge_date', $today)->sum('amount');
                $newReservations = Reservation::whereDate('created_at', $today)->count();

                // Dapatkan tahun terpilih atau default ke tahun saat ini
                $selectedYear = $request->query('year', Carbon::today()->year);

                // Dapatkan daftar tahun unik yang memiliki transaksi
                $availableYears = FolioCharge::selectRaw("DISTINCT YEAR(charge_date) as year")
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();

                if (empty($availableYears)) {
                    $availableYears = [(int)Carbon::today()->year];
                }

                // Pendapatan bulanan (12 bulan penuh untuk tahun terpilih)
                $monthlyRevenue = [];
                for ($m = 1; $m <= 12; $m++) {
                    $monthStart = Carbon::create($selectedYear, $m, 1)->startOfMonth();
                    $monthEnd = Carbon::create($selectedYear, $m, 1)->endOfMonth();
                    $monthLabel = $monthStart->format('M');
                    
                    $total = FolioCharge::whereBetween('charge_date', [$monthStart, $monthEnd])->sum('amount');
                    $monthlyRevenue[] = [
                        'month' => $monthLabel . ' ' . $selectedYear,
                        'total' => (float)$total
                    ];
                }

                return response()->json([
                    'success' => true,
                    'role' => $role,
                    'data' => [
                        'total_rooms' => $totalRooms,
                        'occupied_rooms' => $occupiedRooms,
                        'occupancy_rate' => $occupancyRate,
                        'revenue_today' => (float)$revenueToday,
                        'new_reservations_today' => $newReservations,
                        'monthly_revenue' => $monthlyRevenue,
                        'available_years' => $availableYears,
                        'selected_year' => (int)$selectedYear
                    ]
                ]);

            case 'receptionist':
                // Today's Arrivals, Departures, dan Kamar Kosong Siap Jual (VC)
                $arrivalsCount = Reservation::whereDate('check_in_date', $today)->whereIn('status', ['confirmed', 'pending'])->count();
                $departuresCount = Reservation::whereDate('check_out_date', $today)->where('status', 'checked_in')->count();
                $vacantCleanCount = Room::where('status', 'vc')->count();
                $activeGuests = Room::whereIn('status', ['oc', 'od'])->count();

                return response()->json([
                    'success' => true,
                    'role' => $role,
                    'data' => [
                        'arrivals_today' => $arrivalsCount,
                        'departures_today' => $departuresCount,
                        'vacant_clean_rooms' => $vacantCleanCount,
                        'active_guests_in_house' => $activeGuests
                    ]
                ]);

            case 'housekeeping':
                // Status board summary & Antrian pembersihan
                $statusSummary = Room::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
                $pendingTasks = HousekeepingTask::where('status', 'pending')->count();
                $myActiveTasks = HousekeepingTask::where('assigned_to', $request->user()->id)->where('status', 'in_progress')->count();

                return response()->json([
                    'success' => true,
                    'role' => $role,
                    'data' => [
                        'vc_rooms' => $statusSummary['vc'] ?? 0,
                        'vd_rooms' => $statusSummary['vd'] ?? 0,
                        'oc_rooms' => $statusSummary['oc'] ?? 0,
                        'od_rooms' => $statusSummary['od'] ?? 0,
                        'ooo_rooms' => $statusSummary['ooo'] ?? 0,
                        'oos_rooms' => $statusSummary['oos'] ?? 0,
                        'pending_tasks' => $pendingTasks,
                        'my_active_tasks' => $myActiveTasks
                    ]
                ]);

            case 'fnb':
                // Order F&B aktif hari ini, Total Pendapatan F&B hari ini
                $activeOrders = FnbOrder::where('status', 'proses')->count();
                $fnbRevenueToday = FnbOrder::whereDate('created_at', $today)->where('status', 'selesai')->sum('total');

                return response()->json([
                    'success' => true,
                    'role' => $role,
                    'data' => [
                        'active_orders' => $activeOrders,
                        'fnb_revenue_today' => (float)$fnbRevenueToday
                    ]
                ]);

            default:
                return response()->json(['success' => false, 'message' => 'Role tidak dikenal.'], 403);
        }
    }
}
