<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php 
ob_start();

$update_id = $_POST['id'];
$namee =str_replace("'","`",$_POST['namee']);
$pageData = str_replace("'","`",$_POST['pageData']);
$desc1 = str_replace("'","`",$_POST['desc1']);

$title = str_replace("'","`",$_POST['title']);
$keyword = str_replace("'","`",$_POST['keyword']);
$descr = str_replace("'","`",$_POST['descr']);

	$query = "UPDATE textpage 
	SET namee='{$namee}',
	desc1='{$desc1}',
	pageData='{$pageData}',
	title='{$title}',
	keyword='{$keyword}',
	descr='{$descr}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysql_query($query,$con))
	{
		  	die('Error: ' . mysql_error());
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:textpage.php?pageID=$update_id");

		
?>												
