<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();
$update_id = $_POST['id'];
$namee = mysqli_real_escape_string($_POST['namee']);
$desc1 = mysqli_real_escape_string($_POST['desc1']);
	
	$query = "UPDATE brand 
	SET namee='{$namee}',
	desc1='{$desc1}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:product.php");
?>