<?php
include('../includes/db_settings.php');

$order_id = intval($_GET['order_id']);
$res = mysqli_query($con, "SELECT * FROM order_items WHERE order_id='$order_id'");
if(mysqli_num_rows($res) == 0){
    echo '<p class="text-muted">No items found.</p>';
    exit;
}

echo '<table class="table table-bordered table-condensed table-striped">';
echo '<thead><tr><th>#</th><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead><tbody>';

$count = 1;
while($item = mysqli_fetch_assoc($res)){
    $total = $item['price'] * $item['qty'];
    echo "<tr>
            <td>$count</td>
            <td>".htmlspecialchars($item['name'])."</td>
            <td>".number_format($item['price'],2)." ".$item['currency']."</td>
            <td>{$item['qty']}</td>
            <td>".number_format($total,2)." ".$item['currency']."</td>
          </tr>";
    $count++;
}

echo '</tbody></table>';
