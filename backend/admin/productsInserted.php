<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
	$namee = $_POST['namee'];
	$catID = $_POST['catID'];
 	$mainID = $_POST['mainID'];
    if($catID!='40'){ $price = $_POST['price']; }

	if($catID!='40'){	
	$ins_query_img = "insert into 												
				products(namee,price,catID,mainID)
				values('$namee','$price','$catID','$mainID')";
	}else{
	$ins_query_img = "insert into 												
				products(namee,catID,mainID, price)
				values('$namee','$catID','$mainID', '0')";
	
	}
	echo $ins_query_img;
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			
header("Location:products.php?catID=$catID&mainID=$mainID");
?>
