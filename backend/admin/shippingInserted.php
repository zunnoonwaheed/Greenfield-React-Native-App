<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
	$title = str_replace("'","`",$_POST['title']);
	$rate = str_replace("'","`",$_POST['rate']);
		$weight = str_replace("'","`",$_POST['weight']);

		
	$ins_query_img = "insert into 												
				shipping(title, rate, weight)
				values('$title','$rate', '$weight')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			

header("Location:shipping.php");
?>
