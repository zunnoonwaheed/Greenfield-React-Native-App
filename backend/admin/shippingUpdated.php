<?php require_once("includes/db_settings.php"); ?>
<?php 
ob_start();
$fb = str_replace("'","`",$_POST['fb']);
$twitter = str_replace("'","`",$_POST['twitter']);
$linkedin = str_replace("'","`",$_POST['linkedin']);	
$chat = str_replace("'","`",$_POST['chat']);	
$skype = str_replace("'","`",$_POST['skype']);	
$pinterest = str_replace("'","`",$_POST['pinterest']);	
$callus = str_replace("'","`",$_POST['callus']);	
	$query = "UPDATE shipping 
	SET fb='{$fb}',
	twitter='{$twitter}',
	linkedin='{$linkedin}',
	chat='{$chat}',
	skype='{$skype}',
	pinterest='{$pinterest}',
	callus='{$callus}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:shipping.php");
?>