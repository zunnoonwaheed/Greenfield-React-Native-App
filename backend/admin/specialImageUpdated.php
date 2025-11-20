<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$action = $_GET['action'];
$orderID = $_GET['orderID'];
$statuss= $_GET['statuss'];
if($action=="add"){
	$ins_query_img = "insert into 												
				urgent(orderID)
				values('$orderID')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
}elseif($action=="delete"){
	$query = "DELETE FROM urgent 
			WHERE orderID=$orderID";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			}
}
header("Location:orders.php?statuss=$statuss");
?>
