<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
 $namee = mysqli_real_escape_string($_POST['namee']);
 $catID = $_POST['catID'];
  $mainID = $_POST['mainID'];
 $price = mysqli_real_escape_string($_POST['price']);

	$ins_query_img = "insert into 												
				products(catID,namee,price,mainID)
				values('$catID','$namee','$price','$mainID')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			
header("Location:sbproducts2.php?catID=$catID&mainID=$mainID");
?>
