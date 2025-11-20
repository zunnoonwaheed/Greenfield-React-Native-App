<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
  
	$namee = str_replace("'","`",$_POST['name']);
	$title = str_replace("'","`",$_POST['title']);
	$keyword = str_replace("'","`",$_POST['keyword']);
	$keyword1 = str_replace("'","`",$_POST['keyword1']);
	$keyword2 = str_replace("'","`",$_POST['keyword2']);
	$descr = str_replace("'","`",$_POST['descr']);
	$addhead = str_replace("'","`",$_POST['addhead']);
	$slug = str_replace("'","`",$_POST['slug']);
	
$query_cat = "select * from sizee WHERE slug='$slug'";
//echo $query_cat;
$result_cat = mysqli_query($con,$query_cat); 
$rec_found_cat = mysqli_num_rows($result_cat);
if($rec_found_cat==0){
	
	$ins_query_img = "insert into 												
				sizee(name, title, keyword, keyword1, keyword2, descr, addhead, slug)
				values('$namee', '$title', '$keyword', '$keyword1', '$keyword2', '$descr', '$addhead', '$slug')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}
	//		echo $ins_query_img;	
	header("Location:acc.php");
}else{
	header("Location:insertar.php?msg=1");
}
?>