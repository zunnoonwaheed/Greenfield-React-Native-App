<?php
include("includes/session.php");
include("includes/db_settings.php");
@$UID=$_SESSION['userName'];
@$PWD=$_SESSION['pwd'];
if (($UID=="")&&($PWD=="")){
	header("Location:index.php?msg1=2");
	return;
}
?>
