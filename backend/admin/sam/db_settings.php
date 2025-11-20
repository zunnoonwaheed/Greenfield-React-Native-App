<?php

$host = "localhost";
$user = "root";
$pass = "";
$db_name = "altawash";


//$host = "localhost";
//$user = "altawash_user";
//$pass = "altawash654321";
//$db_name = "altawash_db";


$con = mysql_connect ($host,$user,$pass,$db_name);
	if(!$con){
		echo "<h2> Error Message </h2> " . "<hr/>";
		die("Database connection failed:" . mysql_error()) ;
	} 

$db_select = mysql_select_db ($db_name,$con);
	if(!$db_select) {
			echo "<h2> Error Message </h2> " . "<hr/>";
			die("Database selection failed:" . mysql_error()) ;
	}
	
	
	
?>
