<?php
/**
 * Create user_addresses table in production database
 * Run this script ONCE via browser: https://greenfieldsupermarket.com/mobile-api/backend/create_user_addresses_table.php
 * Then DELETE this file for security
 */

header('Content-Type: text/plain; charset=utf-8');

require_once __DIR__ . '/admin/includes/db_settings.php';

echo "═══════════════════════════════════════════════\n";
echo "  CREATE USER_ADDRESSES TABLE\n";
echo "═══════════════════════════════════════════════\n\n";

// Check connection
if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database: $db_name\n\n";

// Check if table already exists
$check = mysqli_query($con, "SHOW TABLES LIKE 'user_addresses'");
if (mysqli_num_rows($check) > 0) {
    echo "⚠️  Table 'user_addresses' already exists!\n";
    echo "No action needed.\n\n";
    mysqli_close($con);
    exit;
}

echo "📋 Creating 'user_addresses' table...\n";

// Create table
$sql = "CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL DEFAULT 'Home' COMMENT 'Home, Office, Other, etc.',
  `name` varchar(255) NOT NULL COMMENT 'Address nickname or recipient name',
  `address` text NOT NULL COMMENT 'Full address details',
  `building_name` varchar(255) DEFAULT NULL,
  `flat` varchar(50) DEFAULT NULL,
  `floor` varchar(50) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL COMMENT 'Delivery instructions',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = default address, 0 = not default',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_default` (`is_default`),
  KEY `idx_user_default` (`user_id`, `is_default`),
  CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (mysqli_query($con, $sql)) {
    echo "✅ Table 'user_addresses' created successfully!\n\n";

    // Verify table was created
    $verify = mysqli_query($con, "DESCRIBE user_addresses");
    if ($verify) {
        echo "📊 Table structure:\n";
        echo str_repeat("-", 80) . "\n";
        printf("%-20s %-30s %-10s\n", "Field", "Type", "Null");
        echo str_repeat("-", 80) . "\n";
        while ($row = mysqli_fetch_assoc($verify)) {
            printf("%-20s %-30s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
        }
        echo str_repeat("-", 80) . "\n\n";
    }

    echo "✅ Migration complete!\n";
    echo "\n⚠️  IMPORTANT: Delete this file (create_user_addresses_table.php) for security!\n";
} else {
    echo "❌ Error creating table: " . mysqli_error($con) . "\n";
}

mysqli_close($con);
?>
