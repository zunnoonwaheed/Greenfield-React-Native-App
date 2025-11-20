<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$delete_id = $_GET['id'];
$blogID = $_REQUEST['blogID'];
$query = "DELETE FROM blog_comments 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
				header("Location:special.php?blogID=$blogID");
			}
?>

