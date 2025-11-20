<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];

move_uploaded_file($temp1,"upload/cat/" . $browse_file_name1);

$query = "select * from category order by id DESC";
//echo $query;
$result = mysqli_query($con,$query); 
$rec_found = mysqli_fetch_array($result);
//echo $rec_found;
$sortID= $rec_found['sortID'];
//echo $mmid;

$sortID++;



$namee = mysqli_real_escape_string($_POST['namee']);

$catID=$_REQUEST['catID'];

$ins_query_img = "insert into 												
category(namee, sortID, dhp, catID, imagee)
values('$namee', '$sortID', 'yes', '$catID', '$browse_file_name1')";
if (!mysqli_query($con,$ins_query_img))
{
    die('Error: ' . mysqli_error($con));
}	

header("Location:products.php?catID=$catID");
?>
