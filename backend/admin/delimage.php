<?php include("includes/session.php");require_once("includes/db_settings.php"); ?>
<?php
$delete_id = $_GET['id'];
$imgName = $_GET['imgName'];
unlink("upload/right/$imgName");

$query = "DELETE FROM imagee 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:images.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

