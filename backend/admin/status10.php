<?php
include("chkLogin.php");
include("includes/db_settings.php");
?><?php 
ob_start();

$shopID = $_REQUEST['shopID'];
$paidStatuss = str_replace("'","`",$_POST['paidStatuss']);

$query = "UPDATE cart 
	SET paidStatuss='$paidStatuss'
	where shopID='{$shopID}'";		

	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:orders.php?statuss=Current");

		
?>												
