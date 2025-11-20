<?php require_once("includes/db_settings.php"); ?>
<?php
$page=$_GET['page'];
$delete_id = $_GET['id'];

$query = "DELETE FROM members 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:".$page.".php");
			//echo "<h2>id is empty..</h2>";
			}
?>

