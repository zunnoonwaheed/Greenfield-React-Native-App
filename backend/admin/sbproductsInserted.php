<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
 $namee = mysqli_real_escape_string($_POST['namee']);
 $catID = $_POST['catID'];
 $price = mysqli_real_escape_string($_POST['price']);

	$ins_query_img = "insert into 												
				products(catID,namee,price)
				values('$catID','$namee','$price')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			
header("Location:subproducts.php?catID=$catID");
?>
