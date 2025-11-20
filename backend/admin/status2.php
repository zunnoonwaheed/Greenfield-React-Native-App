<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$update_id = $_REQUEST['id'];

$statuss =  str_replace("'","`",$_REQUEST['statuss']);

if ($statuss=="yes"){
	$status1="no";
}elseif ($statuss=="no"){
	$status1="yes";
}
	$query = "UPDATE comments 
	SET statuss='{$status1}'
	where id=$update_id";	
	//echo $query . "<br/>";
	echo $query .'<br>';														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
header("Location:comments.php");

//echo $status1 . '<br>' . $statuss;
?>												
