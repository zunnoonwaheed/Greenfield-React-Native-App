<?php
/**
 * VIEW ERROR LOG
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/view-error-log.php
 * Shows the last 100 lines of error log
 */

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  ERROR LOG VIEWER\n";
echo "  Last 100 lines\n";
echo "═══════════════════════════════════════════════\n\n";

$log_file = __DIR__ . '/error_log.txt';

if (!file_exists($log_file)) {
    echo "ℹ️  No error log file found yet.\n";
    echo "File will be created when first error is logged.\n";
    exit();
}

echo "Log file: $log_file\n";
echo "File size: " . number_format(filesize($log_file)) . " bytes\n";
echo "Last modified: " . date('Y-m-d H:i:s', filemtime($log_file)) . "\n\n";
echo "═══════════════════════════════════════════════\n\n";

// Read last 100 lines
$lines = file($log_file);
$last_lines = array_slice($lines, -100);

foreach ($last_lines as $line) {
    echo $line;
}

echo "\n═══════════════════════════════════════════════\n";
echo "  END OF LOG\n";
echo "═══════════════════════════════════════════════\n";
echo "\n⚠️  IMPORTANT: Delete this file for security!\n";
?>
