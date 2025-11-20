<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");

if (!isset($_SESSION['user_id'])) {
    header("Location: user-login");
    exit;
}

// User info
$stmt = $con->prepare("SELECT id, name, email, phone, address, created_at 
                       FROM users 
                       WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// User orders (by user_id OR by email if user_id is NULL)
$stmt2 = $con->prepare("
    SELECT id, total, currency, statuss, created_at 
    FROM orders 
    WHERE user_id = ? 
       OR (user_id IS NULL AND guest_email = ?)
    ORDER BY created_at DESC
");
$stmt2->bind_param("is", $_SESSION['user_id'], $user['email']);
$stmt2->execute();
$orders = $stmt2->get_result();
?>

<?php include("head.php"); ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container mt-5">
    <div class="card shadow-lg rounded-4">
        <div class="card-body p-4">
            <h3 class="mb-4">
                <i class="bi bi-speedometer2"></i> Dashboard
            </h3>

            <!-- Tabs Navigation -->
            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab">
                        <i class="bi bi-bag-check"></i> Orders History
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab">
                        <i class="bi bi-person-circle"></i> Profile
                    </button>
                </li>
            </ul>

            <!-- Tabs Content -->
            <div class="tab-content mt-4" id="dashboardTabsContent">
                
               
              <!-- Orders Tab -->
<div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">
    <?php if ($orders->num_rows > 0): ?>
        <div class="row">
           <?php while ($order = $orders->fetch_assoc()): ?>
    <?php 
    $statuss = htmlspecialchars($order['statuss']);

    // Display label mapping
    $status_labels = [
        'Current'   => 'Current',
        'Processed' => 'Processed',
        'otw'       => 'On the Way',
        'Delivered' => 'Delivered',
        'Cancel'    => 'Cancelled'
    ];
    $display_status = isset($status_labels[$statuss]) ? $status_labels[$statuss] : $statuss;

    // Badge color mapping
    $badge = "secondary";
    if ($statuss == "Current") $badge = "primary";
    elseif ($statuss == "Processed") $badge = "warning";
    elseif ($statuss == "otw") $badge = "info";  // 👈 Blue for On the Way
    elseif ($statuss == "Delivered") $badge = "success";
    elseif ($statuss == "Cancel") $badge = "danger";
    ?>
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-sm h-100 rounded-3">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-receipt"></i> Order #<?= htmlspecialchars($order['id']); ?>
                </h5>
                <p class="mb-2">
                    <strong>Total:</strong> <?= htmlspecialchars($order['currency'])." ".number_format($order['total'], 2); ?>
                </p>
                <p class="mb-2">
                    <strong>Status:</strong> 
                    <span class="badge bg-<?= $badge; ?>"><?= $display_status; ?></span>
                </p>
                <p class="mb-2">
                    <strong>Date:</strong> <?= date("d M Y h:i A", strtotime($order['created_at'])); ?>
                </p>
            </div>
            <div class="card-footer bg-white border-0 d-grid gap-2">
                <a href="order-details.php?id=<?= $order['id']; ?>" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i> View Details
                </a>
                <?php if ($statuss == "Current" || $statuss == "Processed" || $statuss == "otw"): ?>
                    <a href="order-tracking.php?id=<?= $order['id']; ?>" class="btn btn-sm btn-success">
                        <i class="bi bi-truck"></i> Track Order
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php endwhile; ?>

        </div>
    <?php else: ?>
        <div class="alert alert-info">You have no orders yet.</div>
    <?php endif; ?>
</div>



                <!-- Profile Tab -->
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="card shadow-sm border-0 rounded-3">
                        <div class="card-body">
                            <h5 class="mb-3"><i class="bi bi-person-badge"></i> Profile Details</h5>
                            <table class="table table-borderless">
                               
                                <tr><th>Name:</th><td><?= htmlspecialchars($user['name']); ?></td></tr>
                                <tr><th>Email:</th><td><?= htmlspecialchars($user['email']); ?></td></tr>
                                <tr><th>Phone:</th><td><?= htmlspecialchars($user['phone']); ?></td></tr>
                                <tr><th>Address:</th><td><?= htmlspecialchars($user['address']); ?></td></tr>
                                <tr><th>Created At:</th><td><?= htmlspecialchars($user['created_at']); ?></td></tr>
                            </table>
                            <div class="d-flex justify-content-between mt-3">
                                <a href="/logout.php" class="btn btn-danger"><i class="bi bi-box-arrow-right"></i> Logout</a>
                                <a href="update-profile.php" class="btn btn-primary"><i class="bi bi-pencil-square"></i> Update Profile</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div> <!-- tab-content end -->
        </div>
    </div>
</div>

<?php include("product-js.php");?>
<?php include("footer.php"); ?>
<?php include("js.php"); ?>
</body>
</html>
