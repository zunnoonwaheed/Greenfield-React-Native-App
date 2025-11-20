<?php
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
	$name = str_replace("'","`",$_POST['namee']);
	$currency = str_replace("'","`",$_POST['currency']);
	$exchange_rate = str_replace("'","`",$_POST['exchange_rate']);
		
	$ins_query_img = "insert into 												
				exchange(name, currency, exchange_rate, default_currency)
				values('$name','$currency','$exchange_rate', '1')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
			

header("Location:currency.php");
?>
