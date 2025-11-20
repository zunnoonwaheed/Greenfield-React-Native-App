<?php require_once("includes/db_settings.php"); ?>
<?php 
ob_start();
	$namee = $_POST['namee'];
	$catID = $_POST['catID'];
	$update_id = $_POST['id'];
	$mainID = $_POST['mainID'];
	$price = $_POST['price'];
	
	if($catID!='40'){	
	$query = "UPDATE products 
	SET namee='{$namee}',price='{$price}'
	where id='{$update_id}' AND catID='$catID' AND mainID={$mainID}";	
	//echo $query . "<br/>";						
	}else{
		$query = "UPDATE products 
	SET namee='{$namee}'
	where id='{$update_id}' AND catID='$catID' ";	
	//echo $query . "<br/>";
		}
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:products.php?catID=$catID&mainID=$mainID");
?>