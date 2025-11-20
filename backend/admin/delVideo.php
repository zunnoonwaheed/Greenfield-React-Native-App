<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$delete_id = $_GET['id'];
$imgName = $_GET['imgName'];

$query = "DELETE FROM video 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
				
				unlink("upload/logo/$imgName");

			header("Location:video.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

