<?php
include(__DIR__ . '/../admin/includes/db_settings.php');

echo "════════════════════════════════\n";
echo "  PRODUCTION DATABASE VERIFICATION\n";
echo "════════════════════════════════\n\n";

// Connection check
if ($con) {
    echo "✅ Connected to database: $db_name on host: $db_host\n\n";
} else {
    die("❌ Connection failed\n");
}

// List tables and count records
$result = mysqli_query($con, "SHOW TABLES");
if ($result) {
    echo "📋 Tables and record counts:\n";
    while ($row = mysqli_fetch_row($result)) {
        $table = $row[0];
        $count_result = mysqli_query($con, "SELECT COUNT(*) AS cnt FROM `$table`");
        $count_row = mysqli_fetch_assoc($count_result);
        echo " - $table : " . number_format($count_row['cnt']) . " records\n";
    }
}

mysqli_close($con);

echo "\n✅ All checks complete.\n";
?>
