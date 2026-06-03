<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LatihanController extends Controller
{
    public function index()
    {
        return view('latihan');
    }

    public function tambah()
    {
        $hasil = 0;
        // $title = 'Penjumlahan';
        // return view('tambah', ['jumlah' => $jumlah]);
        // return view('tambah', compact('jumlah', 'title'));
        return view('tambah', compact('hasil'));
    }

    public function actionTambah(Request $request)
    {
        // $title = 'Penjumlahan';
        $angka1 = $request->angka1;
        $angka2 = $request->input('angka2');

        $hasil = $angka1 + $angka2;
        // return view('tambah', compact('hasil', 'title'));
        return view('tambah', compact('hasil'));
    }
    public function kurang()
    {
        $hasil = 0;
        return view('kurang', compact('hasil'));
    }
    public function actionKurang(Request $request)
    {
        $angka1 = $request->input('angka1');
        $angka2 = $request->input('angka2');

        $hasil = $angka1 - $angka2;
        // return view('tambah', compact('hasil'));
        return view('kurang', compact('hasil'));
    }
    public function kali()
    {
        $hasil = 0;
        return view('kali', compact('hasil'));
    }
    public function actionKali(Request $request)
    {
        $angka1 = $request->input('angka1');
        $angka2 = $request->input('angka2');

        $hasil = $angka1 * $angka2;
        // return view('tambah', compact('hasil'));
        return view('kali', compact('hasil'));
    }
    public function bagi()
    {
        $hasil = 0;
        return view('bagi', compact('hasil'));
    }
    public function actionBagi(Request $request)
    {
        $angka1 = $request->input('angka1');
        $angka2 = $request->input('angka2');

        $hasil = $angka1 / $angka2;
        return view('bagi', compact('hasil'));
    }
}
