<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$shopID = $_REQUEST['shopID'];

$statuss =  str_replace("'","`",$_REQUEST['statuss']);

	$query = "UPDATE cart 
	SET statuss='{$statuss}'
	where shopID=$shopID";	
	//echo $query . "<br/>";
	echo $query .'<br>';														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:orders.php?statuss=$statuss");

		
?>												
