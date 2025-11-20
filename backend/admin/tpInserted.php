<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$namee = str_replace("'","`",$_POST['namee']);
$pageData = str_replace("'","`",$_POST['pageData']);
$desc1 = str_replace("'","`",$_POST['desc1']);
$title = str_replace("'","`",$_POST['title']);
$keyword =str_replace("'","`",$_POST['keyword']);
$descr = str_replace("'","`",$_POST['descr']);
$short_desc = str_replace("'","`",$_POST['short_desc']);
$slug = str_replace("'","`",$_POST['slug']);
$slug1 = str_replace("'","`",$_POST['slug1']);
$icon = str_replace("'","`",$_POST['icon']);
$tagline = str_replace("'","`",$_POST['tagline']);
$menu_namee = str_replace("'","`",$_POST['menu_namee']);
$addhead = str_replace("'","`",$_POST['addhead']);
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];
$browse_file_name2 = $_FILES["file2"]["name"];
$temp2 = $_FILES["file2"]["tmp_name"];
$error2 = $_FILES["file2"]["error"];

move_uploaded_file($temp1,"upload/textpage/" . $browse_file_name1);
move_uploaded_file($temp2,"upload/textpage/" . $browse_file_name2);

/*$ins_query_img = "insert into                                                 
textpage(namee ,menu_namee, desc1, pageData, title, keyword, descr, short_desc,pageID, slug, slug1, addhead, icon, tagline)
values('$namee','$menu_namee','$desc1', '$pageData', '$title', '$keyword', '$descr', '$short_desc', '$pageID', '$slug', '$slug1','$addhead', '$icon', '$tagline')";*/

$ins_query_img = "insert into                                                 
textpage(namee ,menu_namee, desc1, pageData, title, keyword, descr, imagee, image2,short_desc, slug, slug1, addhead, icon, tagline)
values('$namee','$menu_namee','$desc1', '$pageData', '$title', '$keyword', '$descr', '$browse_file_name1', '$browse_file_name2','$short_desc', '$slug', '$slug1', '$addhead', '$icon', '$tagline')";
//inecho $ins_query_img;die;

if (!mysqli_query($con,$ins_query_img))
{
    die('Error: ' . mysqli_error($con));
}	


header("Location:tp.php?msg=1");
?>
