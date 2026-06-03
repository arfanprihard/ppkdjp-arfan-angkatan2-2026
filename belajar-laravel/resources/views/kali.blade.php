@extends('main')
@section('title','Pengalian')
@section('content')
<br>
<br>
<form action="{{ route('action-kali') }}" method="POST">
    @csrf

    <label for="">Angka 1</label>
    <input type="text" placeholder="Masukkan Angka" name="angka1">
    x
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