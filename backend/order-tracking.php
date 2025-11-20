<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");

if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Invalid request.");
}

$order_id = (int) $_GET['id'];

$stmt = $con->prepare("
    SELECT id, total, currency, statuss, created_at, delivery_time 
    FROM orders 
    WHERE id = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    die("Order not found.");
}

$statuss = htmlspecialchars($order['statuss']);
$created_at = $order['created_at'];
$delivery_time = $order['delivery_time'];

// Hardcoded delivery times based on status
$delivery_minutes = 0;
if ($statuss == 'Current') $delivery_minutes = 45;
elseif ($statuss == 'Processed') $delivery_minutes = 35;
elseif ($statuss == 'otw') $delivery_minutes = 25;

// Countdown only for Current/Processed/otw
$show_timer = in_array($statuss, ['Current','Processed','otw']);
$expected_time = $show_timer ? date("Y-m-d H:i:s", strtotime($delivery_time . " + $delivery_minutes minutes")) : null;

// Elegant digital clock style
?>
<?php include("head.php"); ?>
<style>
.tracking-card { max-width: 600px; margin: 50px auto; border: none; border-radius: 20px; background: #fff; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
.tracking-header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.tracking-header h3 { font-weight: 600; color: #333; }
.order-info p { margin: 8px 0; font-size: 15px; color: #444; }
.status-badge { padding: 6px 14px; border-radius: 30px; font-size: 14px; font-weight: 600; }
.countdown { 
   font-size: 34px;
    font-weight: 700;
    font-family: sans-serif;
    background:linear-gradient(45deg, #027f1a, #90c443);
    color: #ffffff;
    padding: 20px 35px;
    border-radius: 10px;
    display: inline-block;
    letter-spacing: 3px;
    /* border: 1px dotted #fff; */
    box-shadow: #000 2px 4px 7px 3px;
}
#countdown { min-width: 140px; text-align: center; }
</style>
</head>
<body>
<?php include("header.php"); ?>

<div class="container">
    <div class="card tracking-card">
        <div class="card-body">
            <div class="tracking-header">
                <?php if ($statuss == 'otw'): ?>
                    <i class="bi bi-bicycle fs-2 text-primary"></i>
                <?php else: ?>
                    <i class="bi bi-truck fs-2 text-primary"></i>
                <?php endif; ?>

                <?php if($show_timer): ?>
                    <h3 class="mt-2"><span id="countdown" class="countdown"></span></h3>
                    <p><strong>Expected Delivery:</strong> <?= date("d M Y h:i A", strtotime($expected_time)); ?></p>
                <?php else: ?>
                    <h3 class="mt-2">
                        <?= ($statuss=='otw') ? 'On the Way' : $statuss; ?>
                    </h3>
                    <p style="color:#f33; font-weight:600; font-size:16px; margin-top:10px;">
                        <?php if(in_array($statuss,['Delivered','Cancel','Return'])): ?>
                            <?php if($statuss=='Delivered') echo "Delivered at ".date("d M Y h:i A", strtotime($order['delivery_time'])); ?>
                            <?php if($statuss=='Cancel') echo "This order has been cancelled."; ?>
                            <?php if($statuss=='Return') echo "This order is being returned."; ?>
                        <?php endif; ?>
                    </p>
                <?php endif; ?>
            </div>

            <div class="order-info mt-4">
                <p><strong>Tracking Order #</strong> <?= htmlspecialchars($order['id']); ?></p>
                <p><strong>Total:</strong> <?= htmlspecialchars($order['currency'])." ".number_format($order['total'],2); ?></p>
                <p>
                    <strong>Status:</strong> 
                    <span class="status-badge bg-<?= ($statuss=='Delivered'?'success':($statuss=='Cancel'?'danger':'primary')); ?> text-white">
                        <?= ($statuss=='otw') ? 'On the Way' : $statuss; ?>
                    </span>
                </p>
                <p><strong>Order Placed:</strong> <?= date("d M Y h:i A", strtotime($order['created_at'])); ?></p>
            </div>

            <div class="text-center mt-4">
                <a href="dashboard.php" class="btn btn-outline-secondary rounded-pill px-4">
                    <i class="bi bi-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>
    </div>
</div>

<?php if($show_timer): ?>
<script>
var countDownDate = new Date("<?= $expected_time ?>").getTime();
var countdownEl = document.getElementById("countdown");

function updateCountdown() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    if(distance <= 0) {
        countdownEl.innerHTML = "Delayed! Will be delivered ASAP.";
        countdownEl.style.background = "#333";
        countdownEl.style.color = "#f90";
        countdownEl.style.boxShadow = "0 0 15px #f90, 0 0 30px #f90 inset";
        return;
    }

    var hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    var minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    var seconds = Math.floor((distance % (1000*60)) / 1000);

  countdownEl.innerHTML = "Remaining Time: " + 
    (hours > 0 ? hours + "h " : "") + 
    minutes + "m " + 
    seconds + "s";

}

// Initial call
updateCountdown();
// Update every 1 sec
setInterval(updateCountdown,1000);
// Auto-refresh every 5 sec for accurate timer (Delivered/Cancel/Return pe nahi)
setInterval(function(){ location.reload(); },15000);
</script>
<?php endif; ?>

<?php include("footer.php"); ?>
<?php include("js.php"); ?>
</body>
</html>
