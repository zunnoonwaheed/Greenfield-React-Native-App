<?php
include("chkLogin.php");
include("includes/db_settings.php");
?><?php 
ob_start();

$shopID = $_REQUEST['shopID'];
$balance = str_replace("'","`",$_POST['balance']);

$query = "UPDATE cart 
	SET balance='$balance'
	where shopID='{$shopID}'";		

	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:orders.php?statuss=Current");

		
?>												
