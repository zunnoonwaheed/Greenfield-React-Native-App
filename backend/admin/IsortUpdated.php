<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();

$sortID = $_REQUEST['sortID'];
$id = $_REQUEST['id'];

$sortID1 =  $_REQUEST['sortID1'];
		$idb=$_REQUEST['idb'];


	$query1 = "UPDATE imagee 
	SET sortID='{$sortID1}'
	where id=$id";	
	//echo $query . "<br/>";
	echo $query1 . '<br> ';												
	if (!mysqli_query($con,$query1))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	$query2 = "UPDATE imagee 
	SET sortID='{$sortID}'
	where id=$idb";	
	//echo $query . "<br/>";
	echo $query2;														
	if (!mysqli_query($con,$query2))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	echo 'SortID='.$sortID . '<br> sortID1=' . $sortID1 . '<br>ID=' . $id . '<br>ID1=' . $idb;

	header("Location:images.php");

		
?>												
