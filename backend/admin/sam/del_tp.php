<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$delete_id = $_GET['id'];
$query = "DELETE FROM textpage 
			WHERE id=$delete_id";
			
			if (!mysql_query($query,$con))
			{
				die('Error: ' . mysql_error());
			} else {
			header("Location:tp.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

