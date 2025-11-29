<?php
/**
 * Test Marketplace Ads System
 * Verifies database connection and ad listing
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = 'localhost';
$db = 'greenfieldsuperm_db';
$user = 'root';
$pass = '';

$con = new mysqli($host, $user, $pass, $db);

if ($con->connect_error) {
    die("❌ Connection failed: " . $con->connect_error);
}

echo "✅ Connected to database: $db\n\n";

// Check marketplace_ads table
echo "===== MARKETPLACE ADS TABLE =====\n";
$result = $con->query("SELECT COUNT(*) as total FROM marketplace_ads");
$row = $result->fetch_assoc();
echo "Total ads: " . $row['total'] . "\n\n";

// Get all active ads
$query = "SELECT a.id, a.title, a.price, a.category, a.condition, a.location, a.status, a.created_at,
                 (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as image_count,
                 (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image
          FROM marketplace_ads a
          WHERE a.status = 'active'
          ORDER BY a.created_at DESC
          LIMIT 10";

$result = $con->query($query);

echo "===== ACTIVE ADS =====\n\n";
while ($row = $result->fetch_assoc()) {
    echo "ID: " . $row['id'] . "\n";
    echo "  Title: " . $row['title'] . "\n";
    echo "  Price: Rs. " . number_format($row['price'], 2) . "\n";
    echo "  Category: " . $row['category'] . "\n";
    echo "  Condition: " . $row['condition'] . "\n";
    echo "  Location: " . $row['location'] . "\n";
    echo "  Images: " . $row['image_count'] . "\n";
    echo "  Primary Image: " . ($row['primary_image'] ?: 'None') . "\n";
    echo "  Created: " . $row['created_at'] . "\n";
    echo "  Status: " . $row['status'] . "\n";
    echo "---\n";
}

// Check image files
echo "\n===== IMAGE FILES =====\n";
$uploadsDir = __DIR__ . '/uploads/ads/';
if (is_dir($uploadsDir)) {
    $files = scandir($uploadsDir);
    $imageFiles = array_filter($files, function($file) {
        return !in_array($file, ['.', '..']) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
    });
    echo "Image files in uploads/ads/: " . count($imageFiles) . "\n";
    foreach (array_slice($imageFiles, 0, 5) as $file) {
        $size = filesize($uploadsDir . $file);
        echo "  - $file (" . round($size/1024, 2) . " KB)\n";
    }
} else {
    echo "⚠️  uploads/ads/ directory does not exist\n";
}

// Test API endpoint
echo "\n===== TESTING API ENDPOINT =====\n";
echo "Testing: GET /backend/api/ads.php\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8000/backend/api/ads.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n";

if ($httpCode === 200) {
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && $data['success']) {
        $adCount = count($data['data']['ads'] ?? []);
        echo "✅ API working! Retrieved $adCount ads\n";
        if ($adCount > 0) {
            $firstAd = $data['data']['ads'][0];
            echo "\nFirst ad:\n";
            echo "  ID: " . $firstAd['id'] . "\n";
            echo "  Title: " . $firstAd['title'] . "\n";
            echo "  Price: Rs. " . $firstAd['price'] . "\n";
            echo "  Image: " . ($firstAd['primary_image'] ?? 'None') . "\n";
        }
    } else {
        echo "❌ API returned error\n";
        echo "Response: " . substr($response, 0, 200) . "\n";
    }
} else {
    echo "❌ API request failed with HTTP $httpCode\n";
    echo "Response: " . substr($response, 0, 200) . "\n";
}

$con->close();

echo "\n✅ Test complete!\n";
?>
