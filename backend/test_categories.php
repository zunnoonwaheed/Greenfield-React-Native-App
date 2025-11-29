<?php
// Test categories query
include("admin/includes/db_settings.php");

$query = "SELECT s.id, s.name, s.slug, s.image, s.keyword1,
                 COUNT(d.id) as product_count
          FROM sizee s
          LEFT JOIN dow d ON s.id = d.catID AND d.statuss = '1'
          WHERE s.catID != 0
          GROUP BY s.id, s.name, s.slug, s.image, s.keyword1
          ORDER BY s.name ASC";

$result = mysqli_query($con, $query);

if (!$result) {
    die("Query failed: " . mysqli_error($con));
}

echo "Total categories found: " . mysqli_num_rows($result) . "\n\n";

$withProducts = 0;
$withoutProducts = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $productCount = (int)$row['product_count'];
    if ($productCount > 0) {
        $withProducts++;
    } else {
        $withoutProducts++;
    }
    echo sprintf("%-50s Products: %4d\n", $row['name'], $productCount);
}

echo "\n===== SUMMARY =====\n";
echo "Total Categories: " . ($withProducts + $withoutProducts) . "\n";
echo "With Products: $withProducts\n";
echo "Without Products (will show empty message): $withoutProducts\n";

mysqli_close($con);
?>
