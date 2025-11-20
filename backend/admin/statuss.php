<?php include("chkLogin.php"); ?>
<?php 
ob_start();

$id = $_REQUEST['id'];
$statuss = str_replace("'","`",$_REQUEST['statuss']);

if ($statuss=='yes'){	
	$query = "UPDATE members 
	SET statuss='no'
	where id='{$id}'";	
	//echo $query . "<br/>";														
	
}else{
$query = "UPDATE members 
	SET statuss='yes'
	where id='{$id}'";		
}
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:review.php");

		
?>												
