<?php
include('includes/db_settings.php');

$id = (int)$_POST['id'];
$field = $_POST['field'];
$value = $_POST['value'];

// Sirf category update allowed
$allowedFields = ['catID'];
if(!in_array($field, $allowedFields)){
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid field'
    ]);
    exit;
}

$stmt = $con->prepare("UPDATE dow SET {$field} = ? WHERE id = ?");
$stmt->bind_param("si", $value, $id);

if($stmt->execute()){
    echo json_encode([
        'status' => 'success',
        'message' => 'Category updated successfully!'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'DB update failed'
    ]);
}
