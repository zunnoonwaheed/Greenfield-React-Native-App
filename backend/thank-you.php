<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");
include("head.php");  ?>
<body>
<div id="wrapper">
    <?php include('header.php'); ?>

    <div class="container mt-5 mb-5">
        <div class="card shadow-lg p-4 text-center" style="max-width:600px; margin:auto; border-radius:15px;">
            <h1 class="text-success mb-3"><i class="fa fa-check-circle"></i> Thank You!</h1>
            <?php 
                $order_id = $_GET['order_id'] ?? 0;
                if($order_id):
            ?>
            <p class="lead">Your order has been received successfully.</p>
            <p>Your Order ID is: <strong>#<?= htmlspecialchars($order_id) ?></strong></p>
            <a href="order-tracking.php?id=<?= htmlspecialchars($order_id) ?>" class="btn btn-primary btn-lg mt-3">
                Track Your Order
            </a>
            <?php else: ?>
            <p class="lead">We could not find your order. Please contact support.</p>
            <?php endif; ?>
        </div>
    </div>

    <?php include('footer.php'); ?>
</div>

<style>
.card {
    background: #fff;
}
h1 {
    font-size: 2.5rem;
}
.btn-primary {
    background: #28a745;
    border-color: #28a745;
}
.btn-primary:hover {
    background: #218838;
    border-color: #1e7e34;
}
</style>

<?php include('js.php'); ?>
</body>
</html>
