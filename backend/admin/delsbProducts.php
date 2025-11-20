<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$delete_id = $_GET['id'];
$catID = $_GET['catID'];

$query = "DELETE FROM products 
			WHERE id=$delete_id AND catID=$catID";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:subproducts.php?catID=$catID");
			//echo "<h2>id is empty..</h2>";
			}
?>

