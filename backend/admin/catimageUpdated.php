<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$id = $_REQUEST['id'];
$imgName = $_REQUEST['imgName'];

$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];

	move_uploaded_file($temp1,"upload/cat/" . $browse_file_name1);
	if ($imgName!=""){
		$filename = "upload/cat/$imgName";
		if (file_exists($filename)) {
	unlink("upload/cat/$imgName");
	echo $filename;
		}
	rename ("upload/cat/$browse_file_name1","upload/cat/$imgName");
	}else{
	$query = "UPDATE category 
	SET imagee='{$browse_file_name1}'
	where id=$id";	
	//echo $query . "<br/>";
	echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
		}
header("Location:review.php");
?>
