<?php
include("includes/db_settings.php");
?>
<?php
$email = $_POST['email'];
$namee = str_replace("'","`",$_POST['namee']);
$n_pwd = str_replace("'","`",$_POST['n_pwd']);

$query3 = "select * from members where username='$email' and password ='$namee'";
				//echo $query;
$result3 = mysqli_query($con,$query3); 
$rec_found3 = mysqli_num_rows($result3);

if ($rec_found3!=0){


$query = "UPDATE members 
	SET password='{$n_pwd}'
	where username='{$email}'";	
	//echo $query . "<br/>";														
	if (!mysqli_query($con,$query))
	{
		  	die('Error: ' . mysqli_error($con));
	}
	//echo "<h2> 1 record updated successfully! </h2>";
	header("Location:change_pwd.php?msg=1");
}else{
header("Location:change_pwd.php?msg=2");	
}
?>