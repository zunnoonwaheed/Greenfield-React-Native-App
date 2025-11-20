<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$update_id = $_REQUEST['id'];
$blogID = $_REQUEST['blogID'];
$statuss =  str_replace("'","`",$_REQUEST['statuss']);

if ($statuss=="yes"){
	$status1="no";
}elseif ($statuss=="no"){
	$status1="yes";
}
	$query = "UPDATE blog_comments 
	SET statuss='{$status1}'
	where id=$update_id";	
	//echo $query . "<br/>";
	echo $query .'<br>';														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
header("Location:special.php?blogID=$blogID");
?>												
