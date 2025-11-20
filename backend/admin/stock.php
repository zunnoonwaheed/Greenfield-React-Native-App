<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();
$update_id = $_GET['id'];
$defaultID = $_GET['defaultID'];
	
	$query = "UPDATE exchange 
	SET default_currency='0'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	$query = "UPDATE exchange 
	SET default_currency='1'
	where id='{$defaultID}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:currency.php");
?>