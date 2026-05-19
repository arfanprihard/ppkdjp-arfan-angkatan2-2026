<?php
// KUBUS
function volumeKubus($s)
{
    return pow($s, 3);
}
function lpKubus($s)
{
    return 6 * pow($s, 2);
}

// BALOK
function volumeBalok($p, $l, $t)
{
    return $p * $l * $t;
}

function lpBalok($p, $l, $t)
{
    return 2 * ($p * $l + $p * $t + $l * $t);
}

// Limas
function volumeLimas($s, $t)
{
    return 1 / 3 * pow($s, 2) * $t;
}


// Tabung
function volumeTabung($r, $t)
{
    return M_PI * pow($r, 2) * $t;
}

function lpTabung($r, $t)
{
    return 2 * M_PI * $r * ($r + $t);
}

// Bola
function volumeBola($r)
{
    return 4 / 3 * M_PI * pow($r, 3);
}
function lpBola($r)
{
    return 4 * M_PI * pow($r, 2);
}
