<?php
/**
 * Script to add logging to all backend API endpoints
 * This will update all PHP files in the backend/api directory
 * to include the logger helper and add logging statements
 */

$apiDir = __DIR__ . '/api';
$files = glob($apiDir . '/*.php');

$filesToUpdate = [
    'cart-contents.php',
    'categories.php',
    'category.php',
    'product.php',
    'update-cart.php',
    'remove-from-cart.php',
    'clear-cart.php',
    'logout.php',
    'profile.php',
    'update-profile.php',
    'dashboard.php',
    'change-password.php',
    'delete-account.php',
    'forgot-password.php',
    'reset-password.php',
    'notifications.php',
    'mark-notification-read.php',
    'mark-all-notifications-read.php',
    'locations.php',
    'get-sectors.php',
    'validate-delivery.php',
    'update-delivery.php',
    'bundle.php',
    'bundles.php',
    'add-bundle-to-cart.php',
    'search-products.php',
    'order-details.php'
];

echo "Adding logging to backend API endpoints...\n\n";

foreach ($filesToUpdate as $filename) {
    $filepath = $apiDir . '/' . $filename;

    if (!file_exists($filepath)) {
        echo "⚠️  Skipping $filename (not found)\n";
        continue;
    }

    $content = file_get_contents($filepath);

    // Skip if already has logging
    if (strpos($content, 'require_once("../helpers/logger.php")') !== false) {
        echo "✓ Skipping $filename (already has logging)\n";
        continue;
    }

    // Add logger require at the top (after other requires)
    if (preg_match('/require_once\("..\/helpers\/database\.php"\);/i', $content)) {
        $content = preg_replace(
            '/require_once\("..\/helpers\/database\.php"\);/',
            'require_once("../helpers/database.php");' . "\n" . 'require_once("../helpers/logger.php");',
            $content,
            1
        );
    } elseif (preg_match('/require_once\("..\/helpers\/response\.php"\);/i', $content)) {
        $content = preg_replace(
            '/require_once\("..\/helpers\/response\.php"\);/',
            'require_once("../helpers/response.php");' . "\n" . 'require_once("../helpers/logger.php");',
            $content,
            1
        );
    } elseif (preg_match('/include\("..\/admin\/includes\/db_settings\.php"\);/i', $content)) {
        $content = preg_replace(
            '/include\("..\/admin\/includes\/db_settings\.php"\);/',
            'include("../admin/includes/db_settings.php");' . "\n" . 'require_once("../helpers/logger.php");',
            $content,
            1
        );
    }

    // Add logging initialization after header
    if (preg_match('/header\(\'Content-Type: application\/json\'\);/', $content)) {
        $endpointName = '/api/' . $filename;
        $logCode = "\n\n" . '$startTime = startTimer();' . "\n" .
                   '$endpoint = \'' . $endpointName . '\';' . "\n" .
                   'logRequest($endpoint, $_SERVER[\'REQUEST_METHOD\'], $_REQUEST);' . "\n";

        $content = preg_replace(
            '/header\(\'Content-Type: application\/json\'\);/',
            'header(\'Content-Type: application/json\');' . $logCode,
            $content,
            1
        );
    }

    // Backup original file
    copy($filepath, $filepath . '.backup');

    // Write updated content
    file_put_contents($filepath, $content);

    echo "✅ Updated $filename\n";
}

echo "\n✨ Done! All API endpoints have been updated with logging.\n";
echo "Backup files created with .backup extension.\n";
?>
