<?php
/**
 * Delete test products and show only real products
 */

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

// Option 1: Delete test products (10058-10077)
echo "=== Deleting test products (10058-10077) ===\n";
$sql = "UPDATE dow SET statuss = '0' WHERE id >= 10058 AND id <= 10077";
if ($con->query($sql)) {
    echo "✓ Test products hidden\n\n";
}

// Get real products with images
echo "=== Real products with images ===\n";
$sql = "SELECT id, namee, imagee FROM dow WHERE statuss = '1' AND imagee IS NOT NULL AND imagee != '' AND imagee NOT LIKE '%.png' ORDER BY id DESC LIMIT 20";
$result = $con->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        printf("%6d | %-50s | %s\n", $row['id'], substr($row['namee'], 0, 50), substr($row['imagee'], 0, 40));
    }
} else {
    echo "No real products found\n";
}

$con->close();
?>
