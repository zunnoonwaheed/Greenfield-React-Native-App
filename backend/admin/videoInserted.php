<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php

$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];
	move_uploaded_file($temp1,"upload/logo/" . $browse_file_name1);
	
	$namee = str_replace("'","`",$_POST['namee']);
	$ins_query_img = "insert into 												
				video(namee, filee)
				values('$namee', '$browse_file_name1')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
header("Location:video.php");
?>
