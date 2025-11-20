<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");

// Agar login nahi hai toh login page par redirect
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Agar id nahi mili
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Invalid request.");
}

$order_id = (int) $_GET['id'];
$user_id  = $_SESSION['user_id'];

// Current user email fetch karo
$user_query = $con->prepare("SELECT email FROM users WHERE id = ?");
$user_query->bind_param("i", $user_id);
$user_query->execute();
$user_row = $user_query->get_result()->fetch_assoc();
$user_email = $user_row['email'] ?? null;

// Pehle user_id se order fetch karo
$stmt = $con->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $order_id, $user_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

// Agar user_id match nahi karta, to guest_email check karo
if (!$order && $user_email) {
    $stmt = $con->prepare("SELECT * FROM orders WHERE id = ? AND guest_email = ?");
    $stmt->bind_param("is", $order_id, $user_email);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
}

if (!$order) {
    die("Order not found.");
}

// Order items fetch karo
$order_items_query = $con->prepare("
    SELECT 
        oi.name AS product_name,
        oi.qty AS quantity,
        oi.price AS unit_price,
        oi.total AS total_price
    FROM order_items oi
    WHERE oi.order_id = ?
");
$order_items_query->bind_param("i", $order_id);
$order_items_query->execute();
$order_items = $order_items_query->get_result()->fetch_all(MYSQLI_ASSOC);
?>

<?php include("head.php"); ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container mt-5">
    <div class="card shadow-lg rounded-4">
        <div class="card-body p-4">
            <h3 class="mb-4">
                <i class="bi bi-receipt"></i> Order #<?= htmlspecialchars($order['id']); ?>
            </h3>

            <!-- Order Summary -->
            <div class="mb-4">
           
                <p><strong>Total:</strong> <?= htmlspecialchars($order['currency'])." ".number_format($order['total'], 2); ?></p>
                <p><strong>Status:</strong> 
                    <?php 
                    $statuss = htmlspecialchars($order['statuss']);
                    $badge = "secondary";
                    if ($statuss == "Current") $badge = "primary";
                    elseif ($statuss == "Processed") $badge = "warning";
                    elseif ($statuss == "Delivered") $badge = "success";
                    elseif ($statuss == "Cancel") $badge = "danger";
                    ?>
                    <span class="badge bg-<?= $badge; ?>"><?= $statuss; ?></span>
                </p>
                <p><strong>Date:</strong> <?= date("d M Y h:i A", strtotime($order['created_at'])); ?></p>
            </div>

   <!-- Order Items -->
<h5 class="mb-3"><i class="bi bi-basket"></i> Items</h5>
<?php if (!empty($order_items)): ?>
    <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover align-middle text-center">
            <thead class="table-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
      <tbody>
<?php foreach ($order_items as $index => $item): ?>
    <tr>
        <td><?= $index + 1; ?></td>
        <td class="text-start"><?= htmlspecialchars($item['product_name']); ?></td>
        <td><?= htmlspecialchars($item['quantity']); ?></td>

        <?php if ($item['quantity'] == 0 && $item['unit_price'] == 0 && $item['total_price'] == 0): ?>
            <td colspan="2" class="text-danger fw-bold">Out of Stock</td>
        <?php else: ?>
            <td><?= htmlspecialchars($order['currency'])." ".number_format($item['unit_price'], 2); ?></td>
            <td><strong><?= htmlspecialchars($order['currency'])." ".number_format($item['total_price'], 2); ?></strong></td>
        <?php endif; ?>
    </tr>
<?php endforeach; ?>
    
   
</tbody>
<tfoot>
    <tr>
        <td colspan="4" class="text-end"><strong>Delivery Charges:</strong></td>
        <td><?= htmlspecialchars($order['currency'])." ".number_format($order['delivery_charge'], 2); ?></td>
    </tr>
    <tr>
        <td colspan="4" class="text-end"><strong>Grand Total:</strong></td>
        <td><strong><?= htmlspecialchars($order['currency'])." ".number_format($order['total'], 2); ?></strong></td>
    </tr>
</tfoot>
        </table>
    </div>
<?php else: ?>
    <p class="text-muted">No items found for this order.</p>
<?php endif; ?>



            <!-- Back Button -->
            <div class="mt-4">
                <a href="dashboard.php" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Back to Dashboard</a>
            </div>
        </div>
    </div>
</div>

<?php include("footer.php"); ?>
<?php include("js.php"); ?>
</body>
</html>
