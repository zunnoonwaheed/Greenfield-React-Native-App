<?php include("includes/session.php");require_once("includes/db_settings.php"); ?>
<?php
$delete_id = $_GET['id'];
$catID = $_GET['catID'];
$mainID = $_GET['mainID'];

$query = "DELETE FROM products 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:products.php?catID=$catID&mainID=$mainID");
			//echo "<h2>id is empty..</h2>";
			}
?>

