<?php require_once("includes/db_settings.php"); ?>
<?php 
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];

move_uploaded_file($temp1,"../" . $browse_file_name1);
header("Location:specialImage.php");
?>