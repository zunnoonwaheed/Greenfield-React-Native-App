<?php
include("../admin/includes/db_settings.php");
session_start();

// ✅ Agar id parameter aya ho
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // ✅ Pehle check karo bundle exist karta hai ya nahi
    $checkQ = "SELECT * FROM bundles WHERE id = $id LIMIT 1";
    $checkRes = mysqli_query($con, $checkQ);

    if (mysqli_num_rows($checkRes) > 0) {
        // ✅ Delete query
        $deleteQ = "DELETE FROM bundles WHERE id = $id";
        if (mysqli_query($con, $deleteQ)) {
            $_SESSION['success'] = "Bundle deleted successfully.";
        } else {
            $_SESSION['error'] = "Error deleting bundle: " . mysqli_error($con);
        }
    } else {
        $_SESSION['error'] = "Bundle not found.";
    }
} else {
    $_SESSION['error'] = "Invalid request.";
}

// ✅ Wapis list page par bhejo
header("Location: bundle-list.php");
exit;
?>
