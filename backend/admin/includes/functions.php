<?php 
ob_start();
function confirm_query($con,$result_set){
	if(!$result_set){
		die("Database query failed: " . mysqli_error($con));
	}
}

function redirect($target){
	header("Location:{$target}");
}
?>