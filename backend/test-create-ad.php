<?php
/**
 * TEST AD CREATION
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/test-create-ad.php
 * This will create a test ad and show if it works
 */

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  TEST AD CREATION\n";
echo "═══════════════════════════════════════════════\n\n";

require_once __DIR__ . '/admin/includes/db_settings.php';

if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database\n\n";

// Check if tables exist
echo "📋 Checking tables...\n";
$tables = ['marketplace_ads', 'marketplace_ad_images', 'users'];
foreach ($tables as $table) {
    $result = $con->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        echo "  ✅ $table exists\n";
    } else {
        echo "  ❌ $table MISSING\n";
        die("\n❌ Required tables missing!\n");
    }
}

echo "\n📋 Checking users...\n";
$result = $con->query("SELECT id, name, email FROM users LIMIT 5");
if ($result && $result->num_rows > 0) {
    echo "  Users in database:\n";
    while ($row = $result->fetch_assoc()) {
        echo "    - ID: {$row['id']}, Name: {$row['name']}, Email: {$row['email']}\n";
    }
} else {
    echo "  ❌ No users found\n";
    die("\n❌ No users in database!\n");
}

echo "\n📋 Getting first user...\n";
$result = $con->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
$user_id = $result->fetch_assoc()['id'];
echo "  Using user_id: $user_id\n";

echo "\n📋 Creating test ad...\n";

// Test data
$title = "Test Ad " . date('Y-m-d H:i:s');
$description = "This is a test ad created by test script";
$price = 99.99;
$category = "Electronics";
$subcategory = "Phones";
$condition = "New";
$location = "Islamabad";
$address = "Test Address, Islamabad";
$seller_name = "Test Seller";
$seller_phone = "03001234567";
$seller_email = "test@example.com";
$specifications = json_encode([
    ['key' => 'Brand', 'value' => 'Test Brand'],
    ['key' => 'Model', 'value' => 'Test Model']
]);

echo "  Title: $title\n";
echo "  Price: $price\n";
echo "  Category: $category\n";

// Insert ad
$stmt = $con->prepare("
    INSERT INTO marketplace_ads
    (user_id, title, description, price, category, subcategory, `condition`, location, address, seller_name, seller_phone, seller_email, specifications, status, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)
");

if (!$stmt) {
    echo "\n❌ Failed to prepare statement: " . $con->error . "\n";
    die();
}

$stmt->bind_param('issdsssssssss',
    $user_id,
    $title,
    $description,
    $price,
    $category,
    $subcategory,
    $condition,
    $location,
    $address,
    $seller_name,
    $seller_phone,
    $seller_email,
    $specifications
);

if (!$stmt->execute()) {
    echo "\n❌ Failed to execute: " . $stmt->error . "\n";
    $stmt->close();
    $con->close();
    die();
}

$ad_id = $con->insert_id;
$stmt->close();

echo "\n✅ Ad created successfully!\n";
echo "  Ad ID: $ad_id\n";

// Insert test image
echo "\n📋 Adding test image...\n";
$image_url = "https://via.placeholder.com/300";
$imgStmt = $con->prepare("INSERT INTO marketplace_ad_images (ad_id, image_url, is_primary, sort_order) VALUES (?, ?, 1, 0)");
if ($imgStmt) {
    $imgStmt->bind_param('is', $ad_id, $image_url);
    if ($imgStmt->execute()) {
        echo "  ✅ Image added\n";
    } else {
        echo "  ❌ Image failed: " . $imgStmt->error . "\n";
    }
    $imgStmt->close();
}

// Verify ad
echo "\n📋 Verifying ad...\n";
$fetchStmt = $con->prepare("
    SELECT
        a.*,
        u.name as user_name,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as total_images
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
");

$fetchStmt->bind_param('i', $ad_id);
$fetchStmt->execute();
$result = $fetchStmt->get_result();
$ad = $result->fetch_assoc();
$fetchStmt->close();

if ($ad) {
    echo "  ✅ Ad verified in database\n";
    echo "  ID: {$ad['id']}\n";
    echo "  Title: {$ad['title']}\n";
    echo "  Price: {$ad['price']}\n";
    echo "  Category: {$ad['category']}\n";
    echo "  Status: {$ad['status']}\n";
    echo "  Images: {$ad['total_images']}\n";
    echo "  Primary Image: {$ad['primary_image']}\n";
} else {
    echo "  ❌ Could not fetch ad\n";
}

$con->close();

echo "\n═══════════════════════════════════════════════\n";
echo "  ✅ TEST COMPLETED SUCCESSFULLY!\n";
echo "═══════════════════════════════════════════════\n";
echo "\nYou can now try creating an ad from your mobile app.\n";
echo "If it still fails, check the error log at:\n";
echo "  /public_html/mobile-api/backend/error_log.txt\n";
echo "\n⚠️  IMPORTANT: Delete this test file for security!\n";
?>
