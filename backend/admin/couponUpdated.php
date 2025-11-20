<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();
$update_id = $_POST['id'];
$namee =  str_replace("'","`",$_POST['namee']);
$price = str_replace("'","`",$_POST['price']);
$duration = str_replace("'","`",$_POST['duration']);
$typee = str_replace("'","`",$_POST['typee']);$currency = str_replace("'","`",$_POST['currency']);
	$query = "UPDATE coupon 
	SET code='{$namee}',
	price='{$price}',
	duration='{$duration}',
	typee='{$typee}',
	currency='{$currency}'
	where id=$update_id";	
	//echo $query . "<br/>";
	//echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:coupon.php");
?>												
