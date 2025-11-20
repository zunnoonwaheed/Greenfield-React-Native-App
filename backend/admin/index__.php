<?php 
session_start();
//print_r($_SESSION);die;
/*if(isset($_SESSION['writer_asign']))
{
    if($_SESSION['writer_asign']=="admin")
        $redirectulr="admin/index.php";
        //header("location: orders.php?statuss=Current");
    else if($_SESSION['writer_asign']=="Manager")
        $redirectulr="../manager/index.php";

        header("Location:$redirectulr"); 

}*/

if(isset($_SESSION['writer_asign']))
{
  if($_SESSION['writer_asign']=="admin")
      $redirectulr="../admin/index.php";
  else if($_SESSION['writer_asign']=="Manager")
      $redirectulr="../manager/index.php";
      header("Location:$redirectulr");
}

/*if($_SESSION['writer_asign']!="admin")
{
    $redirectulr="admin/index.php";
    header("Location:$redirectulr");
}*/
/*if($_SESSION["role"]=='subadmin'){
	header("location: tp.php");
}*/
else if($_SESSION["role"]=='admin'){
header("location: orders.php?statuss=Current");
}
else{
header("location: login.php");
}
?>