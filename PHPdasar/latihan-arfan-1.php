<?php

$vKubus = 0;
$lKubus = 0;

$vBalok = 0;
$lBalok = 0;

$vLimas = 0;

$vTabung = 0;
$lTabung = 0;

$vBola = 0;
$lBola = 0;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Kubus
    $sisiKubus = (float)($_POST['sisi-kubus'] ?? 0);

    function volumeKubus($sisi)
    {
        return pow($sisi, 3);
    }

    function luasKubus($sisi)
    {
        return 6 * pow($sisi, 2);
    }

    $vKubus = volumeKubus($sisiKubus);
    $lKubus = luasKubus($sisiKubus);


    // Balok
    $pBalok = (float)($_POST['panjang-balok'] ?? 0);
    $lebarBalok = (float)($_POST['lebar-balok'] ?? 0);
    $tBalok = (float)($_POST['tinggi-balok'] ?? 0);

    function volumeBalok($p, $l, $t)
    {
        return $p * $l * $t;
    }

    function luasBalok($p, $l, $t)
    {
        return 2 * ($p * $l + $p * $t + $l * $t);
    }

    $vBalok = volumeBalok($pBalok, $lebarBalok, $tBalok);
    $lBalok = luasBalok($pBalok, $lebarBalok, $tBalok);


    // Limas Segi Empat
    $sLimas = (float)($_POST['sisi-limas'] ?? 0);
    $tLimas = (float)($_POST['tinggi-limas'] ?? 0);

    function volumeLimas($sisiLimas, $tinggiLimas)
    {
        return 1 / 3 * pow($sisiLimas, 2) * $tinggiLimas;
    }

    $vLimas = volumeLimas($sLimas, $tLimas);


    // Tabung
    $jTabung = (float)($_POST['jari-tabung'] ?? 0);
    $tTabung = (float)($_POST['tinggi-tabung'] ?? 0);

    function volumeTabung($jariTabung, $tinggiTabung)
    {
        return M_PI * pow($jariTabung, 2) * $tinggiTabung;
    }

    function luasTabung($jariTabung, $tinggiTabung)
    {
        return 2 * M_PI * $jariTabung * ($jariTabung + $tinggiTabung);
    }

    $vTabung = volumeTabung($jTabung, $tTabung);
    $lTabung = luasTabung($jTabung, $tTabung);


    // Bola
    $jBola = (float)($_POST['jari-bola'] ?? 0);

    function volumeBola($jariBola)
    {
        return 4 / 3 * M_PI * pow($jariBola, 3);
    }

    function luasBola($jariBola)
    {
        return 4 * M_PI * pow($jariBola, 2);
    }

    $vBola = volumeBola($jBola);
    $lBola = luasBola($jBola);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Bangun Ruang</title>
</head>

<body>

    <h1>Kubus</h1>
    <form action="" method="post">

        <label>Masukkan Sisi</label><br>
        <input type="number" step="any" name="sisi-kubus"><br>

        <p>Volume: <span><?= $vKubus ?></span></p>
        <p>Luas Permukaan: <span><?= $lKubus ?></span></p>

        <button type="submit">Hitung</button>
    </form>


    <h1>Balok</h1>
    <form action="" method="post">

        <label>Masukkan Panjang</label><br>
        <input type="number" step="any" name="panjang-balok"><br>

        <label>Masukkan Lebar</label><br>
        <input type="number" step="any" name="lebar-balok"><br>

        <label>Masukkan Tinggi</label><br>
        <input type="number" step="any" name="tinggi-balok"><br>

        <p>Volume: <span><?= $vBalok ?></span></p>
        <p>Luas Permukaan: <span><?= $lBalok ?></span></p>

        <button type="submit">Hitung</button>
    </form>


    <h1>Limas Segi Empat</h1>
    <form action="" method="post">

        <label>Masukkan Sisi</label><br>
        <input type="number" step="any" name="sisi-limas"><br>

        <label>Masukkan Tinggi</label><br>
        <input type="number" step="any" name="tinggi-limas"><br>

        <p>Volume: <span><?= $vLimas ?></span></p>

        <button type="submit">Hitung</button>
    </form>


    <h1>Tabung</h1>
    <form action="" method="post">

        <label>Masukkan Jari-jari</label><br>
        <input type="number" step="any" name="jari-tabung"><br>

        <label>Masukkan Tinggi</label><br>
        <input type="number" step="any" name="tinggi-tabung"><br>

        <p>Volume: <span><?= $vTabung ?></span></p>
        <p>Luas Permukaan: <span><?= $lTabung ?></span></p>

        <button type="submit">Hitung</button>
    </form>


    <h1>Bola</h1>
    <form action="" method="post">

        <label>Masukkan Jari-jari</label><br>
        <input type="number" step="any" name="jari-bola"><br>

        <p>Volume: <span><?= $vBola ?></span></p>
        <p>Luas Permukaan: <span><?= $lBola ?></span></p>

        <button type="submit">Hitung</button>
    </form>

</body>

</html>