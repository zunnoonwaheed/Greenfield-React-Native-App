<?php
include('head.php');
include('includes/db_settings.php');

$controls = new htmlControl;

// ✅ Agar multiple statuses milein (comma separated), to array banao
$statuss = $_REQUEST['statuss'] ?? 'Current,Processed,otw';
$statusArray = array_map('trim', explode(',', $statuss));

// ✅ Escape values for SQL
$statusArray = array_map(function($val) use ($con) {
    return "'" . mysqli_real_escape_string($con, $val) . "'";
}, $statusArray);

$statusFilter = implode(',', $statusArray);
$con->query("UPDATE orders SET is_seen = 1 WHERE is_seen = 0");
// ✅ Fetch orders
$ordersQ = "SELECT * FROM orders WHERE statuss IN ($statusFilter) ORDER BY created_at DESC";
$ordersRes = mysqli_query($con, $ordersQ);
$orders = [];
while($row = mysqli_fetch_assoc($ordersRes)){
    $orders[] = $row;
}
?>
<style>
.Processed{
    background: #26ff41 !important;
    color: #141313!important;
}
.otw{
    background-color: #a1f6ff!important;
    color: #141313!important;
    
}
</style>
<body>
<div id="wrapper">
    <?php include('left.php'); ?>
    <div id="page-wrapper" class="gray-bg">
        <?php 
        include('header.php');
        echo $controls->getHeaderSection($statuss.' Orders');
        ?>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title mb-2">
                            <button type="button" onclick="location.href='orders.php?statuss=Current,Processed,otw';" class="btn btn-success btn-sm">Current</button>
                            <button type="button" onclick="location.href='orders.php?statuss=Delivered';" class="btn btn-info btn-sm">Delivered</button>
                            <button type="button" onclick="location.href='orders.php?statuss=Cancel';" class="btn btn-danger btn-sm">Cancel</button>
                            <button type="button" onclick="location.href='orders.php?statuss=Return';" class="btn btn-warning btn-sm">Return</button>
                        </div>
<?php if (isset($_GET['msg'])): ?>
    <div class="alert alert-success">
        <?= htmlspecialchars($_GET['msg']); ?>
    </div>
<?php endif; ?>
                        <div class="ibox-content">
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped" id="ordersTable">
                                    <thead>
                                        <tr>
 
                                            <th>Order ID</th>
                                            <th>Guest</th>
                                            <th>Address</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                   <tbody>
<?php foreach($orders as $order): ?>
    <tr class="<?= $order['statuss'] ?>">
     
        <td><?= $order['id']; ?></td>
        <td>
            <?= htmlspecialchars($order['guest_name']); ?><br>
            <?= htmlspecialchars($order['guest_email']); ?><br>
            <?= htmlspecialchars($order['guest_phone']); ?>
        </td>
        <td><?= htmlspecialchars($order['guest_address']); ?></td>
        <td><?= number_format($order['total'],2).' '.$order['currency']; ?></td>
        <td>
          <form method="post" action="ajax/update-order-status.php" style="display:inline;">
    <input type="hidden" name="id" value="<?= $order['id']; ?>">
    <select name="status" class="form-control" onchange="this.form.submit()">
        <option value="Current" <?= $order['statuss']=='Current'?'selected':''; ?>>Current</option>
          <option value="Processed" <?= $order['statuss']=='Processed'?'selected':''; ?>>Processed</option>
        <option value="otw" <?= $order['statuss']=='otw'?'selected':''; ?>>On the Way</option>
        <option value="Delivered" <?= $order['statuss']=='Delivered'?'selected':''; ?>>Delivered</option>
        <option value="Cancel" <?= $order['statuss']=='Cancel'?'selected':''; ?>>Cancel</option>
             <option value="Return" <?= $order['statuss']=='Return'?'selected':''; ?>>Return</option>
    </select>
</form>
        </td>
        <td>
          <form method="post" action="ajax/update-payment-status.php" style="display:inline;">
    <input type="hidden" name="id" value="<?= $order['id']; ?>">
    <select name="payment_status" class="form-control" onchange="this.form.submit()">
        <option value="Pending" <?= $order['payment_status']=='Pending'?'selected':''; ?>>Pending</option>
        <option value="COD" <?= $order['payment_status']=='COD'?'selected':''; ?>>Cash on Delivery</option>
        <option value="Online" <?= $order['payment_status']=='Online'?'selected':''; ?>>Online Card</option>
        <option value="Received" <?= $order['payment_status']=='Received'?'selected':''; ?>>Received</option>
    </select>
</form>

        </td>
        <td>
            <button class="btn btn-xs btn-info" data-toggle="collapse" data-target="#items-<?= $order['id']; ?>">
                View Items
            </button>
        </td>
    </tr>

    <!-- Accordion row -->
    <tr>
        <td colspan="8" class="p-0">
            <div id="items-<?= $order['id']; ?>" class="collapse">
                <div class="p-3 bg-light">
                    <h5>Order Items</h5>
     <table id="order-table-<?= $order['id']; ?>" class="table table-sm table-bordered">
    <thead>
        <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <?php  
        $itemsQ = "SELECT * FROM order_items WHERE order_id=".$order['id'];
        $itemsRes = mysqli_query($con, $itemsQ);
        $subTotal = 0; $i=1;
        while($item = mysqli_fetch_assoc($itemsRes)){
            $lineTotal = $item['qty'] * $item['price'];
            $subTotal += $lineTotal;
        ?>
            <tr id="item-<?= $item['id']; ?>">
                <td>
                    <?= $i++; ?>
                    <button class="btn btn-xs btn-danger out-of-stock" data-id="<?= $item['id']; ?>" data-order="<?= $order['id']; ?>">Out of Stock</button>
                </td>
                <td><?= htmlspecialchars($item['name']); ?></td>
                <td><?= $item['qty']; ?></td>
                <td><?= number_format($item['price'],2).' '.$order['currency']; ?></td>
                <td><?= number_format($lineTotal,2).' '.$order['currency']; ?></td>
            </tr>
        <?php } ?>
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4" class="text-right">Subtotal:</th>
            <th id="subtotal-<?= $order['id']; ?>"><?= number_format($subTotal,2).' '.$order['currency']; ?></th>
        </tr>
        <tr>
            <th colspan="4" class="text-right">Delivery Charges:</th>
            <th id="delivery-<?= $order['id']; ?>"><?= number_format($order['delivery_charge'],2).' '.$order['currency']; ?></th>
        </tr>
        <tr>
            <th colspan="4" class="text-right">Grand Total:</th>
            <th id="grandtotal-<?= $order['id']; ?>"><?= number_format($order['total'],2).' '.$order['currency']; ?></th>
        </tr>
    </tfoot>
</table>

                </div>
            </div>
        </td>
    </tr>
<?php endforeach; ?>
</tbody>

                                </table>
                            </div>
                        </div> <!-- ibox-content -->
                    </div> <!-- ibox -->
                </div>
            </div>
        </div>
         
               <?php include('script.php'); ?>


        <?php include('footer.php'); ?>
 
    </div>
</div>

<!-- jQuery 2.x -->

<script>
document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".out-of-stock").forEach(btn => {
        btn.addEventListener("click", function(){
            let itemId = this.dataset.id;
            let orderId = this.dataset.order;

            if(confirm("Are you sure you want to mark this item as Out of Stock?")){
                fetch("update-item.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: "id=" + itemId
                })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        let row = document.getElementById("item-" + itemId);
                        row.querySelector("td:nth-child(3)").innerText = "0"; // qty
                        row.querySelector("td:nth-child(4)").innerText = "0.00 <?= $order['currency']; ?>"; // price
                        row.querySelector("td:nth-child(5)").innerText = "0.00 <?= $order['currency']; ?>"; // total

                        // Update footer cells by ID
                        document.getElementById("subtotal-" + orderId).innerText = 
                            parseFloat(data.subtotal).toFixed(2) + " <?= $order['currency']; ?>";

                        document.getElementById("delivery-" + orderId).innerText = 
                            parseFloat(data.delivery).toFixed(2) + " <?= $order['currency']; ?>";

                        document.getElementById("grandtotal-" + orderId).innerText = 
                            parseFloat(data.total).toFixed(2) + " <?= $order['currency']; ?>";
                    } else {
                        alert("Error updating item");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    alert("Something went wrong!");
                });
            }
        });
    });
});
</script>








<style>
.orderItemsRow td { background-color: #f9f9f9; }
</style>

</body>
</html>
