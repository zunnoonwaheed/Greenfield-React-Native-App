<?php require_once("includes/db_settings.php"); ?>
<?php
$delete_id = $_GET['id'];

$query = "DELETE FROM comments 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
				

			header("Location:comments.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

