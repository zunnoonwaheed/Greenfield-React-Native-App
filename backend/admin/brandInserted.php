<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
  
	$namee = str_replace("'","`",$_POST['name']);
	$title = str_replace("'","`",$_POST['title']);
	$descr = str_replace("'","`",$_POST['descr']);
	$addhead = str_replace("'","`",$_POST['addhead']);
	$slug = str_replace("'","`",$_POST['slug']);
	$mainID = str_replace("'","`",$_POST['mainID']);
	
$query_cat = "select * from brands WHERE slug='$slug'";
//echo $query_cat;
$result_cat = mysqli_query($con,$query_cat); 
$rec_found_cat = mysqli_num_rows($result_cat);
if($rec_found_cat==0){
	
	$ins_query_img = "insert into 												
				brands(name, title, descr, addhead, slug, mainID)
				values('$namee', '$title', '$descr', '$addhead', '$slug', '$mainID')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}
	//		echo $ins_query_img;	
	header("Location:brands.php");
}else{
	header("Location:insertbrand.php?msg=1");
}
?>