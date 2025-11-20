<?php
include("includes/db_settings.php");
?>
<?php 
ob_start();
$update_id = $_POST['id'];
$detail_instructions = str_replace("'","`",$_POST['detail_instructions']);
$sources_ref = str_replace("'","`",$_POST['sources_ref']);
$your_topic = str_replace("'","`",$_POST['your_topic']);
$price = str_replace("'","`",$_POST['price']);
$dCode = str_replace("'","`",$_POST['dCode']);
$gamount = str_replace("'","`",$_POST['gamount']);
$email = str_replace("'","`",$_POST['email']);
$farmaish = str_replace("'","`",$_POST['farmaish']);
$page_words = str_replace("'","`",$_POST['page_words']);
$writing_service = str_replace("'","`",$_POST['writing_service']);
$help_require = str_replace("'","`",$_POST['help_require']);
$topic = str_replace("'","`",$_POST['topic']);
$pre_slide = str_replace("'","`",$_POST['pre_slide']);
$line_space = str_replace("'","`",$_POST['line_space']);
$soft_service = str_replace("'","`",$_POST['soft_service']);
$writing_style = str_replace("'","`",$_POST['writing_style']);
$language_style = str_replace("'","`",$_POST['language_style']);
$edu_level = str_replace("'","`",$_POST['edu_level']);
$paper_stnd = str_replace("'","`",$_POST['paper_stnd']);
$deadline = str_replace("'","`",$_POST['deadline']);
	
$query = "UPDATE cart 
	SET price='{$price}',
	dcode='{$dcode}',
	email='{$email}',
	gamount='{$gamount}',
	farmaish='{$farmaish}',
	page_words='{$page_words}',
	your_topic='{$your_topic}',
	detail_instructions='{$detail_instructions}',
	writing_service='{$writing_service}',
	help_require='{$help_require}',
	topic='{$topic}',
	pre_slide='{$pre_slide}',
	sources_ref='{$sources_ref}',
	line_space='{$line_space}',
	soft_service='{$soft_service}',
	writing_style='{$writing_style}',
	language_style='{$language_style}',
	edu_level='{$edu_level}',
	paper_stnd='{$paper_stnd}',
	deadline='{$deadline}'
	where id='{$update_id}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}

	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:orders.php?statuss=Current");
?>
