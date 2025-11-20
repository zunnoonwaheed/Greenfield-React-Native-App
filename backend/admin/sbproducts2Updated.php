<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();
	$namee = mysqli_real_escape_string($_POST['namee']);
	$catID = $_POST['catID'];
	$update_id = $_POST['id'];
	$price = mysqli_real_escape_string($_POST['price']);
	$query = "UPDATE products 
	SET namee='{$namee}',
	price='{$price}'
	where id='{$update_id}' AND catID='$catID' ";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:sbproducts2.php?catID=$catID");
?>