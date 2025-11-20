<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];
	move_uploaded_file($temp1,"../img/" . $browse_file_name1);
$linkk=$_POST['linkk'];
$align=$_POST['align'];
$alt=$_POST['alt'];
	$query = "insert into 												
				imagee(linkk, imagee, align, alt)
				values('$linkk', '$browse_file_name1', '$align','$alt')";
			if (!mysqli_query($con,$query))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
header("Location:images.php");
?>
