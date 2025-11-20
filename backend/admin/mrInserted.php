<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$query = "select * from category order by id DESC";
				//echo $query;
	$result = mysqli_query($con,$query); 
	$rec_found = mysqli_fetch_array($result);
	//echo $rec_found;
	$sortID= $rec_found['sortID'];
	//echo $mmid;
			
			$sortID++;

	

	$namee = mysqli_real_escape_string($_POST['namee']);
		$pmethod = mysqli_real_escape_string($_POST['pmethod']);

	$title = mysqli_real_escape_string($_POST['title']);
$keyword = mysqli_real_escape_string($_POST['keyword']);
$descr = mysqli_real_escape_string($_POST['descr']);


	$ins_query_img = "insert into 												
				category(namee, sortID, dhp, catID, title, keyword, descr)
				values('$namee', '$sortID', 'yes', 0, '$title', '$keyword', '$descr')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	


header("Location:review.php");
?>
