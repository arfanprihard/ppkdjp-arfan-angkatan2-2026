<?php
require 'function.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <a href="?bangun=kubus">Kubus</a>
    <a href="?bangun=balok">Balok</a>
    <a href="?bangun=limas">Limas Segi Empat</a>
    <a href="?bangun=tabung">Tabung</a>
    <a href="?bangun=bola">Bola</a>
    <form action="?bangun=<?php echo isset($_GET['bangun']) ? $_GET['bangun'] : '' ?>" method="post">
        <?php
        if (isset($_GET['bangun']) && $_GET['bangun'] == 'kubus') {
        ?>
            <label for="">Kubus</label>
            <input type="number" step="any" name="s">
        <?php
        } elseif (isset($_GET['bangun']) && $_GET['bangun'] == 'balok') {
        ?>
            <label for="">Panjang</label>
            <input type="number" step="any" name="p">
            <label for="">Lebar</label>
            <input type="number" step="any" name="l">
            <label for="">Tinggi</label>
            <input type="number" step="any" name="t">
        <?php
        } elseif (isset($_GET['bangun']) && $_GET['bangun'] == 'limas') {
        ?>
            <label for="">Sisi Limas</label>
            <input type="number" step="any" name="sLimas">
            <label for="">Tinggi Limas</label>
            <input type="number" step="any" name="tLimas">
        <?php
        } elseif (isset($_GET['bangun']) && $_GET['bangun'] == 'tabung') {
        ?>
            <label for="">Jari Jari</label>
            <input type="number" step="any" name="rTabung">
            <label for="">Tinggi Tabung</label>
            <input type="number" step="any" name="tTabung">
        <?php
        } else if (isset($_GET['bangun']) && $_GET['bangun'] == 'bola') {
        ?>
            <label for="">Jari Jari</label>
            <input type="number" step="any" name="rBola">
        <?php
        }
        ?>
        <button type="submit" name="hitung">Hitung</button>
    </form>
    <?php
    $bangun = $_GET['bangun'] ?? '';
    if ($bangun == 'kubus') {
        $s = $_POST['s'] ?? 0;
        $vol = volumeKubus($s);
        $lp = lpKubus($s);
        echo "Sisi = $s " . "<br>";
        echo "<strong>Volume: (s^3) = " . round($vol, 2) . "</strong><br>";
        echo "<strong>Luas Permukaan: 6 x (s^2) = " . round($lp, 2) . "</strong><br>";
    } elseif ($bangun == 'balok') {
        $p = $_POST['p'] ?? 0;
        $l = $_POST['l'] ?? 0;
        $t = $_POST['t'] ?? 0;
        $vol = volumeBalok($p, $l, $t);
        $lp = lpBalok($p, $l, $t);
        echo "Panjang = $p Lebar = $l Tinggi = $t" . "<br>";
        echo "<strong>Volume: p x l x t = " . round($vol, 2) . "</strong><br>";
        echo "<strong>Luas Permukaan: 2 x (p x l + p x t + l x t) = " . round($lp, 2) . "</strong><br>";
    } elseif ($bangun == 'limas') {
        $s = $_POST['sLimas'] ?? 0;
        $t = $_POST['tLimas'] ?? 0;
        $vol = volumeLimas($s, $t);
        echo "Sisi = $s Tinggi = $t" . "<br>";
        echo "<strong>Volume: 1/3 x (s^2) x t = " . round($vol, 2) . "</strong><br>";
    } elseif ($bangun == 'tabung') {
        $r = $_POST['rTabung'] ?? 0;
        $t = $_POST['tTabung'] ?? 0;
        $vol = volumeTabung($r, $t);
        $lp = lpTabung($r, $t);
        echo "Jari-jari = $r Tinggi = $t" . "<br>";
        echo "<strong>Volume: " . round(M_PI, 2) . " x (r^2) x t = " . round($vol, 2) . "</strong><br>";
        echo "<strong>Luas Permukaan: 2 x " . round(M_PI, 2) . " x r x (r + t) = " . round($lp, 2) . "</strong><br>";
    } elseif ($bangun == 'bola') {
        $r = $_POST['rBola'] ?? 0;
        $vol = volumeBola($r);
        $lp = lpBola($r);
        echo "Jari-jari = $r" . "<br>";
        echo "<strong>Volume: 4/3 x " . round(M_PI, 2) . " x (r^3) = " . round($vol, 2) . "</strong><br>";
        echo "<strong>Luas Permukaan: 4 x " . round(M_PI, 2) . " x (r^2) = " . round($lp, 2) . "</strong><br>";
    }
    ?>
</body>

</html>