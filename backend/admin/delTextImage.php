<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
 $delete_id = $_GET['pageID'];
 $colu = $_GET['colu'];
 $imgName = $_GET['imgName'];

unlink("upload/textpage/$imgName");



$query = "UPDATE  textpage SET  ".$colu."='' 
			WHERE id=$delete_id" ;
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			header("Location:tp.php");
			//echo "<h2>id is empty..</h2>";
			}
?>

