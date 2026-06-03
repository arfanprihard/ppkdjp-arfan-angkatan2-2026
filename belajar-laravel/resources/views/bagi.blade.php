@extends('main')
@section('title','Pembagian')
@section('content')
<br>
<br>
<form action="{{ route('action-bagi') }}" method="POST">
    @csrf

    <label for="">Angka 1</label>
    <input type="text" placeholder="Masukkan Angka" name="angka1">
    /
    <label for="">Angka 2</label>
    <input type="text" placeholder="Masukkan Angka" name="angka2">
    <br>
    <br>
    <button type="submit">Proses</button>
</form>
<h1>
    Hasil = {{ $hasil }}
</h1>

@endsection