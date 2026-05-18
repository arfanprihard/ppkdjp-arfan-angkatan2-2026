<?php
const email = "susi@gmail.xom";

echo email . "<br>";

define("contoh", "Sulis");
echo contoh . "<br>";

$fruits = array("Apel", "Mangga", "Pisang");
$cars = ["Toyota", "Mazda", "Honda"];

// var_dump($fruits);
echo "<br>";
array_push($fruits, "Quldi", "Anggur");
foreach ($fruits as $index => $fruit) {
    echo $fruit;
    echo $fruits[$index] . "<br>";
}

// Array Asosiative
$motorcycles = [[
    'merek' => 'Supra',
    'warna' => 'Hitam',
    'tahun' => 2019,
    'cc' => 125,
], [
    'merek' => 'Vespa',
    'warna' => 'Merah',
    'tahun' => 2026,
    'cc' => 150,
], [
    'merek' => 'Aerok',
    'warna' => 'Kuning',
    'tahun' => 2018,
    'cc' => 160,
]];

// var_dump($motorcycles);

foreach ($motorcycles as $index => $motorcycle) {
?>
    <ul>
        <li>
            <?php echo "Nama motor: " . $motorcycle['merek'] ?>
        </li>
        <li>
            <?php echo "Warna motor: " . $motorcycle['warna'] ?>
        </li>
        <li>
            <?php echo "Tahun motor: " . $motorcycle['tahun'] ?>
        </li>
        <li>
            <?php echo "CC motor: " . $motorcycle['cc'] ?>
        </li>
    </ul>
<?php
}

// foreach ($motorcycles as $motorcycle) {
//     echo "<ul>
//         <li>Nama motor: " . $motorcycle['merek'] . "</li>
//         <li>Warna Motor: " . $motorcycle['warna'] . "</li>
//         <li>Tahun Motor: " . $motorcycle['tahun'] . "</li>
//         <li>CC Motor: " . $motorcycle['cc'] . "</li>
//     </ul>";
// }


$nama = "Budi";
if ($nama == "Anto") {
    echo "Salah";
} else {
    echo "Benar";
}

echo "<br>";

$nilai = 100;
if ($nilai >= 90 && $nilai <= 100) {
    echo "A";
} elseif ($nilai >= 80 && $nilai <= 100) {
    echo "B";
} elseif ($nilai < 80) {
    echo "C";
} else {
    echo "Kebanyakan";
}



function namaAnda($name, $age)
{
    return "Nama Anda adalah $name, usia anda adalah $age tahun";
}

echo namaAnda("Arfan", 24);
