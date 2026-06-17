<?php
/**
 * Diagnostic script to test file paths
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Path Diagnostic</h1>";

echo "<h2>Current Directory:</h2>";
echo "<pre>" . __DIR__ . "</pre>";

echo "<h2>Files in Current Directory:</h2>";
echo "<pre>";
print_r(scandir(__DIR__));
echo "</pre>";

echo "<h2>Looking for db_settings.php:</h2>";
$paths_to_check = [
    __DIR__ . '/../admin/includes/db_settings.php',
    __DIR__ . '/../../admin/includes/db_settings.php',
    __DIR__ . '/../../../admin/includes/db_settings.php',
    '/home/greenfieldsuperm/public_html/mobile-api/backend/admin/includes/db_settings.php',
    '/home/greenfieldsuperm/public_html/backend/admin/includes/db_settings.php',
];

foreach ($paths_to_check as $path) {
    $exists = file_exists($path) ? '✅ EXISTS' : '❌ NOT FOUND';
    echo "$exists - $path<br>";
}

echo "<h2>Document Root:</h2>";
echo "<pre>" . $_SERVER['DOCUMENT_ROOT'] . "</pre>";

echo "<h2>Script Filename:</h2>";
echo "<pre>" . $_SERVER['SCRIPT_FILENAME'] . "</pre>";
?>
