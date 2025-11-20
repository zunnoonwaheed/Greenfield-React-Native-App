<?php include("includes/session.php"); ?>
<?php
// Put this code in first line of web page.
setcookie("userName", "", time()-3600);
setcookie("pwd", "", time()-3600);
$_SESSION = array();
session_destroy();
echo '<script language="javascript">window.location=\'login.php\';</script>';
?>