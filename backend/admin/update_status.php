<?php
include("includes/session.php");
include("includes/db_settings.php");
 
$id = $_GET['id'];
$newStatus = $_GET['status'];

if (isset($id) && isset($newStatus)) {
    $updateQuery = "UPDATE dow SET statuss = '$newStatus' WHERE id = '$id'";
    if (mysqli_query($con, $updateQuery)) {
        // redirect back to main page or show message
        header("Location: posts.php");
    } else {
        echo "Error updating record: " . mysqli_error($con);
    }
} else {
    echo "Invalid request.";
}
?>
