<?php
include("includes/db_settings.php");

$action = $_POST['action'] ?? '';

if($action == "add_location"){
    $name = $con->real_escape_string($_POST['name']);
    $type = $con->real_escape_string($_POST['type']);
    $parent_id = !empty($_POST['parent_id']) ? intval($_POST['parent_id']) : "NULL";

    $con->query("INSERT INTO locations (parent_id, name, type) VALUES ($parent_id, '$name', '$type')");
    echo "Location Added Successfully";

} elseif($action == "delete_location"){
    $id = intval($_POST['id']);
    $con->query("DELETE FROM locations WHERE id=$id");
    echo "Location Deleted";

} elseif($action == "add_or_update_charge"){
    $area = $con->real_escape_string($_POST['area']);
    $sector = $con->real_escape_string($_POST['sector']);
    $charge = $con->real_escape_string($_POST['charge']);

    // Check if exists
    $chk = $con->query("SELECT id FROM delivery_charges WHERE area='$area' AND sector='$sector'");
    if($chk->num_rows > 0){
        $row = $chk->fetch_assoc();
        $con->query("UPDATE delivery_charges SET charge='$charge' WHERE id=".$row['id']);
        echo "Delivery Charge Updated";
    } else {
        $con->query("INSERT INTO delivery_charges (area, sector, charge) VALUES ('$area', '$sector', '$charge')");
        echo "Delivery Charge Added";
    }

} elseif($action == "update_charge"){
    $id = intval($_POST['id']);
    $charge = $con->real_escape_string($_POST['charge']);
    $con->query("UPDATE delivery_charges SET charge='$charge' WHERE id=$id");
    echo "Charge Updated";

} elseif($action == "delete_charge"){
    $id = intval($_POST['id']);
    $con->query("DELETE FROM delivery_charges WHERE id=$id");
    echo "Delivery Charge Deleted";
}
