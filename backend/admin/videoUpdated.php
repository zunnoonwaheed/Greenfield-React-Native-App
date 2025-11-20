<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();

$update_id = $_POST['id'];
$namee = str_replace("'","`",$_POST['namee']);

	$query = "UPDATE video 
	SET namee='{$namee}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:video.php");		
?>												