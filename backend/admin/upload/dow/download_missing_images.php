<?php
/**
 * Download missing product images from production site
 */

// Database connection
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}

// Get all products with images
$query = "SELECT id, namee, imagee FROM dow WHERE statuss = '1' AND imagee IS NOT NULL AND imagee != '' LIMIT 100";
$result = $con->query($query);

$missing = [];
$downloaded = 0;
$failed = [];
$already_exists = 0;

while ($row = $result->fetch_assoc()) {
    $imageName = $row['imagee'];
    $localPath = __DIR__ . '/' . $imageName;

    // Check if file exists locally
    if (file_exists($localPath) && filesize($localPath) > 1000) {
        $already_exists++;
        echo "✓ EXISTS: {$imageName}\n";
        continue;
    }

    // Try to download from production
    $productionUrl = "https://greenfieldsupermarket.com/admin/upload/dow/" . $imageName;

    echo "⬇ Downloading: {$productionUrl}\n";

    $ch = curl_init($productionUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $imageData = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200 && $imageData && strlen($imageData) > 1000) {
        file_put_contents($localPath, $imageData);
        $downloaded++;
        echo "  ✅ Downloaded successfully (" . number_format(strlen($imageData)) . " bytes)\n";
    } else {
        $missing[] = [
            'id' => $row['id'],
            'name' => $row['namee'],
            'image' => $imageName,
            'http_code' => $httpCode
        ];
        echo "  ❌ Failed (HTTP {$httpCode})\n";
    }

    usleep(200000); // 200ms delay between downloads
}

echo "\n=== SUMMARY ===\n";
echo "Already exists: {$already_exists}\n";
echo "Downloaded: {$downloaded}\n";
echo "Missing: " . count($missing) . "\n\n";

if (!empty($missing)) {
    echo "Missing images:\n";
    foreach ($missing as $item) {
        echo "  - {$item['image']} (Product: {$item['name']}, HTTP: {$item['http_code']})\n";
    }
}

$con->close();
?>
