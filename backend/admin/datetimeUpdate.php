<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$update_id = $_POST['id'];
$ddt = $_POST['ddt'];
$statuss = $_POST['statuss'];
	$query = "UPDATE cart 
	SET ddt='{$ddt}'
	where id=$update_id";	
	//echo $query . "<br/>";
	//echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	header("Location:orders.php?statuss=$statuss");
?>												
