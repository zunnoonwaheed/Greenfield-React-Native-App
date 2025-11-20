<?php include("includes/session.php");require_once("includes/db_settings.php"); ?>
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
$short_desc = str_replace("'","`",$_POST['short_desc']);
$slug = str_replace("'","`",$_POST['slug']);
$slug1 = str_replace("'","`",$_POST['slug1']);
$icon = str_replace("'","`",$_POST['icon']);
$tagline = str_replace("'","`",$_POST['tagline']);
$menu_namee = str_replace("'","`",$_POST['menu_namee']);
$addhead = str_replace("'","`",$_POST['addhead']);
	$query = "UPDATE textpage 
	SET namee='{$namee}',
	desc1='{$desc1}',
	pageData='{$pageData}',
	title='{$title}',
	keyword='{$keyword}',
	descr='{$descr}',
	short_desc='{$short_desc}',
	slug='{$slug}',
	slug1='{$slug1}',
	menu_namee='{$menu_namee}',
	addhead='{$addhead}',
	icon='{$icon}',
	tagline='{$tagline}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}

$imgName=$_POST['imagName'];	
$imgName1=$_POST['imagName1'];	
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];

	move_uploaded_file($temp1,"upload/textpage/" . $browse_file_name1);
	
if($browse_file_name1!=""){	
if ($imgName!=""){
		$filename = "upload/textpage/$imgName";
		if (file_exists($filename)) {
	unlink("upload/textpage/$imgName");
	echo $filename;
		}
	
	rename ("upload/textpage/$browse_file_name1","upload/textpage/$imgName");
	}else{
		
	$query = "UPDATE textpage 
	SET imagee='{$browse_file_name1}'
	where id=$update_id";	
	//echo $query . "<br/>";
	echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	
		}
}

$browse_file_name2 = $_FILES["file2"]["name"];
$temp2 = $_FILES["file2"]["tmp_name"];
$error2 = $_FILES["file2"]["error"];

	move_uploaded_file($temp2,"upload/textpage/" . $browse_file_name2);
	
if($browse_file_name2!=""){	
if ($imgName1!=""){
		$filename = "upload/textpage/$imgName1";
		if (file_exists($filename)) {
	unlink("upload/textpage/$imgName1");
	//echo $filename;
		}
	
	rename ("upload/textpage/$browse_file_name2","upload/textpage/$imgName1");
	}else{
		
	$query = "UPDATE textpage 
	SET image2='{$browse_file_name2}'
	where id=$update_id";	
	//echo $query . "<br/>";
	echo $query;														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	
		}
}



	header("Location:textpage.php?pageID=$update_id");
?>												