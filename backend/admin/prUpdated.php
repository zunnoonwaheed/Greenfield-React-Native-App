<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php 
ob_start();
$page=$_POST['page'];
$update_id = $_POST['id'];

$namee =  str_replace("'","`",$_POST['namee']);
$username =  str_replace("'","`",$_POST['username']);
$password =  str_replace("'","`",$_POST['password']);
$query = "UPDATE  members
SET namee='{$namee}',
username='{$username}'
where id=$update_id";	
//echo $query . "<br/>";
echo $query;														
if (!mysqli_query($con,$query))
{
    die('Error: ' . mysqli_error($con));
}
if ($password!=""){
    $query = "UPDATE members 
    SET password ='".addslashes(mysqli_real_escape_string(md5($password)))."'
    WHERE id=$update_id";
    //echo $query;	
    //$picture=$_FILES["browse_file"]["name"];
    if (!mysqli_query($con,$query))
    {
        die('Error: ' . mysqli_error($con));
    }
}
//echo "<h2> 1 record updated successfully! </h2>";
header("Location:".$page.".php");


?>												
