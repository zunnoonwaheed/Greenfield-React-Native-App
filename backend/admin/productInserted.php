<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
	$namee = mysqli_real_escape_string($_POST['namee']);
	$desc1 = mysqli_real_escape_string($_POST['desc1']);
	$ins_query_img = "insert into 												
				brand(namee, desc1)
				values('$namee', '$desc1')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			

header("Location:product.php");
?>
