<?php
header('Content-Type: application/json');
include("admin/includes/db_settings.php");

$q = $_POST['q'] ?? '';
$q = mysqli_real_escape_string($con, $q);

$sql = "SELECT id, namee, slug, imagee, price, dprice
        FROM dow
        WHERE namee LIKE '%$q%'
        LIMIT 10";
$res = mysqli_query($con, $sql);

$products = [];
if (mysqli_num_rows($res) > 0) {
    while ($row = mysqli_fetch_assoc($res)) {
        $price = $row['dprice'] > 0 ? $row['dprice'] : $row['price'];
        $image = !empty($row['imagee']) ? "/admin/upload/dow/".$row['imagee'] : "/img/header-1.jpg";

        $products[] = [
            'id' => $row['id'],
            'name' => $row['namee'],
            'slug' => $row['slug'],
            'price' => $price,
            'image' => $image
        ];
    }
}

echo json_encode([
    'success' => true,
    'products' => $products,
    'count' => count($products)
]);
?>
