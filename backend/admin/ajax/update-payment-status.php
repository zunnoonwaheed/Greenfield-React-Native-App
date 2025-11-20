<?php
include('../includes/db_settings.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    $payment_status = mysqli_real_escape_string($con, $_POST['payment_status']);

    $allowed = ['Pending', 'COD', 'Online', 'Received'];

    if (in_array($payment_status, $allowed)) {
        $updateQ = "UPDATE orders SET payment_status='$payment_status' WHERE id=$id";
        if (mysqli_query($con, $updateQ)) {
            header("Location: ../orders.php?msg=Payment status updated successfully!");
            exit;
        } else {
            header("Location: ../orders.php?msg=Error updating payment status!");
            exit;
        }
    } else {
        header("Location: ../orders.php?msg=Invalid payment status!");
        exit;
    }
} else {
    header("Location: ../orders.php?msg=Invalid request!");
    exit;
}
