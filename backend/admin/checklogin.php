<?php require_once("includes/db_settings.php");?>
<?php // username and password sent from form 
$myusername=str_replace("'","`",$_POST['usr_name']); 
$mypassword=str_replace("'","`",$_POST['pwd']); 
//echo $myusername;
//echo $mypassword;

$sql="SELECT * FROM members WHERE username='$myusername' and password='$mypassword'";
$result=mysqli_query($con,$sql);

$count=mysqli_num_rows($result);

if($count==1){
// Register $myusername, $mypassword and redirect to file "login_success.php"

session_start();
$_SESSION['myusername'] = $myusername;
echo $_SESSION['myusername'];
//session_start();
//session_register('myusername');
//session_start();
//session_register("mypassword"); 
header("location:login_success.php");
}
else {
echo "Wrong Username or Password";
}

?>

