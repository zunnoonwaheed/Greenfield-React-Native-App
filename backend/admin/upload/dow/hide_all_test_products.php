<?php
/**
 * Hide ALL test products with .png images (10001-10077)
 */

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

echo "=== Hiding ALL Test Products ===\n\n";

// Hide all products with .png images (test data)
$sql = "UPDATE dow SET statuss = '0' WHERE imagee LIKE '%.png'";
if ($con->query($sql)) {
    $affected = $con->affected_rows;
    echo "✓ Hidden {$affected} test products with .png images\n\n";
} else {
    echo "✗ Failed to hide test products\n";
    exit(1);
}

// Show real products that are now active
echo "=== Real Products Now Active (First 30) ===\n";
$sql = "SELECT id, namee, imagee FROM dow WHERE statuss = '1' AND imagee IS NOT NULL AND imagee != '' ORDER BY id ASC LIMIT 30";
$result = $con->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        printf("%6d | %-50s | %s\n", $row['id'], substr($row['namee'], 0, 50), substr($row['imagee'], 0, 40));
    }
} else {
    echo "No real products found\n";
}

echo "\n=== Summary ===\n";
$totalActive = $con->query("SELECT COUNT(*) as count FROM dow WHERE statuss = '1'")->fetch_assoc()['count'];
echo "Total active products: {$totalActive}\n";

$con->close();
?>
