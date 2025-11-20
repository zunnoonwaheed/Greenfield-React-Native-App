<?php
session_start();
include("admin/includes/db_settings.php");
include("html.php");

// Agar login nahi hai toh login page par redirect
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// User ka data database se nikal lo (fresh data dikhane ke liye)
$stmt = $con->prepare("SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
?>
<?php include("head.php"); ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container mt-5">
    <div class="card shadow p-4">
        <h3 class="mb-4">Welcome, <?= htmlspecialchars($user['name']); ?> 👋</h3>

        <table class="table table-bordered">
            
            <tr>
                <th>Name</th>
                <td><?= htmlspecialchars($user['name']); ?></td>
            </tr>
            <tr>
                <th>Email</th>
                <td><?= htmlspecialchars($user['email']); ?></td>
            </tr>
            <tr>
                <th>Phone</th>
                <td><?= htmlspecialchars($user['phone']); ?></td>
            </tr>
            <tr>
                <th>Address</th>
                <td><?= htmlspecialchars($user['address']); ?></td>
            </tr>
            <tr>
                <th>Created At</th>
                <td><?= htmlspecialchars($user['created_at']); ?></td>
            </tr>
        </table>

        <div class="d-flex justify-content-between mt-4">
            <a href="/logout.php" class="btn btn-danger">Logout</a>
            <a href="update-profile.php" class="btn btn-primary">Update Profile</a>
        </div>
    </div>
</div>
<?php include("js/product-js.php");?>
<?php include("footer.php"); ?>
<?php include("js.php"); ?>
</body>
</html>
