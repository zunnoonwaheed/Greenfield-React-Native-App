<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();

$pageData = str_replace("'","`",$_POST['pageData']);

	$ins_query_img = "insert into 												
				newsletter(pageData)
				values('$pageData')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	

	
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:newsletter.php");

		
?>												
