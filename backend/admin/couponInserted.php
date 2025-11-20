<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$namee = str_replace("'","`",$_POST['namee']);
$duration = str_replace("'","`",$_POST['duration']);
$price = str_replace("'","`",$_POST['price']);
$typee = str_replace("'","`",$_POST['typee']);
$currency = str_replace("'","`",$_POST['currency']);
	$ins_query_img = "insert into 												
				coupon(code, price, statuss, shopID, duration,  typee, currency)
				values('$namee', '$price', 'Unassigned', '0', '$duration', '$typee', '$currency')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			
header("Location:coupon.php");
?>
