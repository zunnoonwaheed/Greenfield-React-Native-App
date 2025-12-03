<?php
/**
 * DELETE TEST ADS
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/delete-test-ads.php
 * Deletes test ads (IDs 21 and 22)
 */

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  DELETE TEST ADS\n";
echo "═══════════════════════════════════════════════\n\n";

require_once __DIR__ . '/admin/includes/db_settings.php';

if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database\n\n";

// Delete test ads (IDs 21, 22)
$test_ad_ids = [21, 22];

foreach ($test_ad_ids as $ad_id) {
    echo "📋 Deleting ad ID: $ad_id\n";

    // First delete images
    $stmt = $con->prepare("DELETE FROM marketplace_ad_images WHERE ad_id = ?");
    $stmt->bind_param('i', $ad_id);
    $stmt->execute();
    $images_deleted = $stmt->affected_rows;
    $stmt->close();
    echo "  ✅ Deleted $images_deleted images\n";

    // Then delete ad
    $stmt = $con->prepare("DELETE FROM marketplace_ads WHERE id = ?");
    $stmt->bind_param('i', $ad_id);
    $stmt->execute();
    $ads_deleted = $stmt->affected_rows;
    $stmt->close();

    if ($ads_deleted > 0) {
        echo "  ✅ Ad deleted successfully\n";
    } else {
        echo "  ⚠️  Ad not found or already deleted\n";
    }
    echo "\n";
}

// Show remaining ads
echo "═══════════════════════════════════════════════\n";
echo "  REMAINING ADS\n";
echo "═══════════════════════════════════════════════\n\n";

$result = $con->query("SELECT id, title, created_at FROM marketplace_ads ORDER BY created_at DESC");
if ($result && $result->num_rows > 0) {
    while ($ad = $result->fetch_assoc()) {
        echo "ID: {$ad['id']} - {$ad['title']} ({$ad['created_at']})\n";
    }
} else {
    echo "No ads remaining\n";
}

$con->close();

echo "\n✅ DONE!\n";
echo "\n⚠️  IMPORTANT: Delete this file for security!\n";
?>
