<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$imgName=$_POST['imgName'];
$id=$_POST['id'];
$align=$_POST['align'];
$linkk=$_POST['linkk'];
$alt=$_POST['alt'];
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];
	move_uploaded_file($temp1,"../img/" . $browse_file_name1);

	$query = "UPDATE imagee 
	SET linkk='$linkk',
	align='$align',
	alt='$alt'
	where id='{$id}'";
			if (!mysqli_query($con,$query))
				  {
				  die('Error: ' . mysqli_error($con));
			}
			
			if ($browse_file_name1!=""){
				$query = "UPDATE imagee 
	SET imagee='{$browse_file_name1}'
	where id='{$id}'";
			if (!mysqli_query($con,$query))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			unlink("upload/right/$imgName");
			}

header("Location:images.php");
?>
