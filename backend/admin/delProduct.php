<?php require_once("includes/db_settings.php"); ?>
<?php
$delete_id = $_GET['id'];

$imgName = $_GET['imgName'];
$filename = "upload/acc/$imgName";
		if (file_exists($filename)) {
unlink("upload/acc/$imgName");
		}

$query = "DELETE FROM brand 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:product.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

