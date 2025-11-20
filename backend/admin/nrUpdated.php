<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$update_id = $_POST['id'];

$namee =  mysqli_real_escape_string($_POST['namee']);
$title = mysqli_real_escape_string($_POST['title']);
$keyword = mysqli_real_escape_string($_POST['keyword']);
$descr = mysqli_real_escape_string($_POST['descr']);


	$query = "UPDATE category 
	SET namee='{$namee}',
	title='{$title}',
	keyword='{$keyword}',
	descr='{$descr}'
	where id=$update_id";	
	//echo $query . "<br/>";
	echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	
	$query1 = "select * from category where id=$update_id";
				//echo $query;
	$result1 = mysqli_query($con,$query1); 
	$rec_found1 = mysqli_fetch_array($result1);
	$catID=$rec_found1['catID'];		

	if ($catID=="0"){
	header("Location:review.php");
	}
	else
	{
		header("Location:products.php?catID=$catID");
		}
		
?>												
