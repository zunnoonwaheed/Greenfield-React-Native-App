<?php
/**
 * CHECK ADS IN DATABASE
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/check-ads.php
 */

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  CHECKING ADS IN DATABASE\n";
echo "═══════════════════════════════════════════════\n\n";

require_once __DIR__ . '/admin/includes/db_settings.php';

if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database\n\n";

// Count total ads
$result = $con->query("SELECT COUNT(*) as total FROM marketplace_ads");
$total = $result->fetch_assoc()['total'];
echo "📊 Total ads in database: $total\n\n";

if ($total == 0) {
    echo "⚠️  No ads found in database!\n";
    $con->close();
    exit();
}

// Show all ads
echo "📋 Ads List:\n";
echo "─────────────────────────────────────────────\n\n";

$query = "
    SELECT
        a.id,
        a.title,
        a.price,
        a.category,
        a.subcategory,
        a.condition,
        a.location,
        a.status,
        a.views,
        a.created_at,
        u.name as seller_name,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as image_count
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 20
";

$result = $con->query($query);

if ($result && $result->num_rows > 0) {
    while ($ad = $result->fetch_assoc()) {
        echo "ID: {$ad['id']}\n";
        echo "Title: {$ad['title']}\n";
        echo "Price: PKR {$ad['price']}\n";
        echo "Category: {$ad['category']}" . ($ad['subcategory'] ? ", {$ad['subcategory']}" : "") . "\n";
        echo "Condition: {$ad['condition']}\n";
        echo "Location: {$ad['location']}\n";
        echo "Status: {$ad['status']}\n";
        echo "Views: {$ad['views']}\n";
        echo "Images: {$ad['image_count']}\n";
        echo "Primary Image: " . ($ad['primary_image'] ?: "None") . "\n";
        echo "Seller: {$ad['seller_name']}\n";
        echo "Created: {$ad['created_at']}\n";
        echo "─────────────────────────────────────────────\n\n";
    }
}

// Test API response format
echo "\n═══════════════════════════════════════════════\n";
echo "  TESTING API RESPONSE FORMAT\n";
echo "═══════════════════════════════════════════════\n\n";

$query = "
    SELECT
        a.*,
        u.name as seller_name,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as image_count
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.status = 'active'
    ORDER BY a.created_at DESC
    LIMIT 5
";

$result = $con->query($query);
$ads = [];

while ($row = $result->fetch_assoc()) {
    $ads[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'price' => floatval($row['price']),
        'category' => $row['category'],
        'subcategory' => $row['subcategory'],
        'condition' => $row['condition'],
        'location' => $row['location'],
        'status' => $row['status'],
        'views' => intval($row['views']),
        'featured' => boolval($row['featured']),
        'primary_image' => $row['primary_image'],
        'image_count' => intval($row['image_count']),
        'seller_name' => $row['seller_name'],
        'created_at' => $row['created_at']
    ];
}

echo "JSON Response (what API returns):\n";
echo json_encode([
    'success' => true,
    'data' => [
        'ads' => $ads,
        'pagination' => [
            'current_page' => 1,
            'per_page' => 20,
            'total' => $total,
            'total_pages' => ceil($total / 20)
        ]
    ]
], JSON_PRETTY_PRINT);

$con->close();

echo "\n\n✅ DONE!\n";
echo "\n⚠️  IMPORTANT: Delete this file for security!\n";
?>
