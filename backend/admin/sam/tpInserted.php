<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php

$update_id = $_POST['id'];
$namee = str_replace("'","`",$_POST['namee']);
$pageData = str_replace("'","`",$_POST['pageData']);
$desc1 = str_replace("'","`",$_POST['desc1']);

$title = str_replace("'","`",$_POST['title']);
$keyword =str_replace("'","`",$_POST['keyword']);
$descr = str_replace("'","`",$_POST['descr']);

	$ins_query_img = "insert into 												
				textpage(namee, desc1, pageData, title, keyword, descr)
				values('$namee', '$desc1', '$pageData', '$title', '$keyword', '$descr')";
			if (!mysql_query($ins_query_img,$con))
				  {
				  die('Error: ' . mysql_error());
			}	


header("Location:tp.php");
?>
