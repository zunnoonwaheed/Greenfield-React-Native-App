<?php
include("../includes/db_settings.php"); // DB connection
date_default_timezone_set("Asia/Karachi"); // Pakistan time
$current_time = date("Y-m-d H:i:s");
if(isset($_POST['id'], $_POST['status'])){
    $id = intval($_POST['id']);
    $status = $_POST['status'];

    // Har status per current timestamp update
    $current_time = date("Y-m-d H:i:s");
    $query = "UPDATE orders SET statuss='$status', delivery_time='$current_time' WHERE id=$id";
    mysqli_query($con, $query);
}

header("Location: ../orders.php");
exit;
?>
