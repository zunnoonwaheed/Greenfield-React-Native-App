<?php require_once("includes/db_settings.php"); ?>
<?php
$pin=$_POST['pin'];
if ($pin=="Password123#"){
	$shopID = $_GET['shopID'];
	$statuss = $_GET['statuss'];
	$query = "DELETE FROM cart 
			WHERE shopID=$shopID";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} else {
			?>
<script type="text/javascript">
alert("Deleted Successfully");
document.location = 'orders.php?statuss=Current';
</script>
            <?php	
			}
}else{
?>
<script type="text/javascript">
alert("Invalid Pin");
document.location = 'orders.php?statuss=Current';
</script>
<?php	
	
}
?>

