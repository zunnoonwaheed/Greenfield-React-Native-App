<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$update_id = $_REQUEST['id'];
$statuss =  str_replace("'","`",$_REQUEST['statuss']);

	$query_prod = "UPDATE coupon 
	SET statuss='{$statuss}'
	where id=$update_id";	
	//echo $query_prod . "<br/>";
	//echo $query;														
	if (!mysqli_query($con,$query_prod))
	{
		  	die('Error: ' . mysqli_error($con));
	}

	header("Location:https://www.paperwriter.co.uk/admin/coupon.php");
?>												
