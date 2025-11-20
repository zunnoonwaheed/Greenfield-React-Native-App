<?php require_once("includes/db_settings.php"); ?>
<?php
$catID = $_GET['catID'];
$mainID = $_GET['mainID'];
$delete_id = $_GET['id'];
$imgName = $_GET['imgName'];
$query = "DELETE FROM dow 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
				unlink("upload/dow/$imgName");
				header("Location:posts.php?catID=$catID&mainID=$mainID");
			}?>