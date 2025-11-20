<?php 
session_start();
require_once("includes/db_settings.php"); ?>
<?php
//ob_start();
$new_pwd = $_POST['new_pwd'];


	//    id  whats_new_title  description  image     
	$query = "UPDATE members 
				SET password ='".addslashes(mysqli_real_escape_string(md5($new_pwd)))."'
				WHERE members.username ='".$_SESSION['userName']."'";
	//echo $query;	
	//exit();
	//$picture=$_FILES["browse_file"]["name"];
		if (!mysqli_query($con,$query))
  		{
  			die('Error: ' . mysqli_error($con));
  		}
		//echo "<h2>1 record added successfully!</h2>";
		header("Location: orders.php?statuss=Current");
?>
