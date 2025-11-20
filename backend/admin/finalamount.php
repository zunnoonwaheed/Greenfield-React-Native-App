<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();
$orderID = $_POST['id'];
$balanceAmount = str_replace("'","`",$_POST['balanceAmount']); 
$query = "UPDATE affiliate
	SET balanceAmount='$balanceAmount'
   where id='{$update_id}'";	

	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:Location:orders.php?statuss=Current");

		
?>												
