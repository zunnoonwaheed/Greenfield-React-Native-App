<?php
include("chkLogin.php");
include("includes/db_settings.php");
?>
<?php require_once("includes/functions.php"); ?>
<?php
$query = "select * from stores order by sortID DESC";
$result = mysqli_query($con,$query); 
$rec_found = mysqli_fetch_array($result);
$sortID= $rec_found['sortID'];
$sortID++;
$browse_file_name1 = $_FILES["file1"]["name"];
$temp1 = $_FILES["file1"]["tmp_name"];
$error1 = $_FILES["file1"]["error"];
move_uploaded_file($temp1,"upload/stores/" . $browse_file_name1);
$linkk = str_replace("'","`",$_POST['linkk']);
    $ins_query_img = "insert into                                                 
                stores(imagee, linkk, sortID, websiteID)
                values('$browse_file_name1','$linkk', '$sortID', ".$_SESSION['websiteID'].")";
            if (!mysqli_query($con,$ins_query_img))
                  {
                  die('Error: ' . mysqli_error($con));
            }    
header("Location:stores.php");
?>
