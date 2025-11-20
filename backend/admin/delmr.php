<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$delete_id = $_GET['id'];

$query1 = "select * from category where id=$delete_id";
				//echo $query;
	$result1 = mysqli_query($con,$query1); 
	$rec_found1 = mysqli_fetch_array($result1);
	$catID=$rec_found1['catID'];	
	
$query = "DELETE FROM category 
			WHERE id=$delete_id";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
				if ($catID=="0"){
	header("Location:review.php");
	}
	else
	{
		header("Location:products.php?catID=$catID");
		}
		
				
		}
?>

