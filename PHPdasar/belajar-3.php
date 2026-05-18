<?php
$hasil = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $nim = $_POST['nim'];
    $alamat = $_POST['alamat'];
    $angka1 = (float)$_POST['angka1'] ?? 0;
    $angka2 = (float)$_POST['angka2'] ?? 0;
    $operator = $_POST['operator'];

    function hasilPerhitungan($angka1, $angka2, $operator)
    {
        if ($operator == "*") {
            return $angka1 * $angka2;
        } elseif ($operator == "/") {
            return $angka1 / $angka2;
        } elseif ($operator == "-") {
            return $angka1 - $angka2;
        } elseif ($operator == "+") {
            return $angka1 + $angka2;
        }
    }

    echo "Nama saya $name NIM saya $nim, saya beralamat di $alamat";
    $hasil = hasilPerhitungan($angka1, $angka2, $operator);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="" method="post">
        <label>Nama</label><br>
        <input type="text" name="name"><br>

        <label>NIM</label><br>
        <input type="number" name="nim"><br>

        <label>Alamat</label><br>
        <textarea name="alamat" cols="30" rows="5"></textarea><br>

        <label>Number 1</label><br>
        <input type="number" step="any" name="angka1"><br>

        <label for="">Operator</label><br>
        <input name="operator" type="radio" value="+">+
        <input name="operator" type="radio" value="-">-
        <input name="operator" type="radio" value="*">*
        <input name="operator" type="radio" value="/">/
        <br>

        <label>Number 2</label><br>
        <input type="number" step="any" name="angka2"><br>

        <label>Hasil</label><br>
        <input type="text" value="<?= $hasil ?>"><br>
        <button type="submit">Tampilkan Data</button>
    </form>
</body>

</html>