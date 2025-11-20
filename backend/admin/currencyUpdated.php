<?php require_once("includes/db_settings.php"); ?>
<?php 
ob_start();
$update_id = $_POST['id'];
$namee = str_replace("'","`",$_POST['namee']);
$currency = str_replace("'","`",$_POST['currency']);
$exchange_rate = str_replace("'","`",$_POST['exchange_rate']);
	
	$query = "UPDATE exchange 
	SET name='{$namee}',
	currency='{$currency}',
	exchange_rate='{$exchange_rate}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:currency.php");
?>