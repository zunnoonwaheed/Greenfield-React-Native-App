<?php
/**
 * Download specific category images from production for product placeholders
 */

$images = [
    // Coffee & Tea
    'coffee.png' => 'https://greenfieldsupermarket.com/images/categories/coffee.jpg',
    'tea.png' => 'https://greenfieldsupermarket.com/images/categories/tea.jpg',

    // Beverages
    'water.png' => 'https://greenfieldsupermarket.com/images/categories/water.jpg',

    // Try alternate URLs if above don't work
    'coffee-alt.png' => 'https://via.placeholder.com/400x400/6F4E37/FFFFFF/?text=COFFEE',
    'tea-alt.png' => 'https://via.placeholder.com/400x400/C4A962/000000/?text=TEA',
    'water-alt.png' => 'https://via.placeholder.com/400x400/87CEEB/000000/?text=WATER',
];

foreach ($images as $filename => $url) {
    echo "Downloading {$filename} from {$url}...\n";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200 && $data && strlen($data) > 1000) {
        file_put_contents($filename, $data);
        echo "  ✓ Downloaded (" . number_format(strlen($data)) . " bytes)\n";
    } else {
        echo "  ✗ Failed (HTTP {$httpCode})\n";
    }
}
?>
