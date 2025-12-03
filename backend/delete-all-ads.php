<?php
/**
 * DELETE ALL ADS
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/delete-all-ads.php
 * WARNING: This deletes ALL marketplace ads!
 */

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  DELETE ALL MARKETPLACE ADS\n";
echo "  ⚠️  WARNING: This will delete ALL ads!\n";
echo "═══════════════════════════════════════════════\n\n";

require_once __DIR__ . '/admin/includes/db_settings.php';

if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database\n\n";

// Count current ads
$result = $con->query("SELECT COUNT(*) as total FROM marketplace_ads");
$total = $result->fetch_assoc()['total'];
echo "📊 Current ads in database: $total\n\n";

if ($total == 0) {
    echo "ℹ️  No ads to delete\n";
    $con->close();
    exit();
}

// Show ads before deletion
echo "📋 Ads to be deleted:\n";
$result = $con->query("SELECT id, title FROM marketplace_ads ORDER BY id");
while ($ad = $result->fetch_assoc()) {
    echo "  - ID {$ad['id']}: {$ad['title']}\n";
}
echo "\n";

// Delete all images first
echo "🗑️  Deleting ad images...\n";
$con->query("DELETE FROM marketplace_ad_images");
$images_deleted = $con->affected_rows;
echo "  ✅ Deleted $images_deleted images\n\n";

// Delete all ads
echo "🗑️  Deleting ads...\n";
$con->query("DELETE FROM marketplace_ads");
$ads_deleted = $con->affected_rows;
echo "  ✅ Deleted $ads_deleted ads\n\n";

// Verify deletion
$result = $con->query("SELECT COUNT(*) as total FROM marketplace_ads");
$remaining = $result->fetch_assoc()['total'];

echo "═══════════════════════════════════════════════\n";
echo "  DELETION COMPLETE\n";
echo "═══════════════════════════════════════════════\n\n";
echo "✅ All ads deleted\n";
echo "📊 Remaining ads: $remaining\n";

$con->close();

echo "\n⚠️  IMPORTANT: Delete this file for security!\n";
?>
