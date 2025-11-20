<?php
include("chkLogin.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Pro Writer Admin Panel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--<title>Untitled Document</title>-->
    </head>

    <body>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <?php
            $query = "select * from imagee ";


            $results  = mysqli_query($con,$query);
            $rec_found = mysqli_num_rows($results);

            ?>
            <?php


            for ($s=0; $s < mysqli_num_rows ($results); $s++){

                mysqli_data_seek($results, $s);
                $row=mysqli_fetch_array($results);
                $aid=$row['id'];	

                ?>







                <tr>
                    <td width="30%" align="left" valign="top" class="text6"><img src="upload/right/<?php echo $row['imagee'];?>" width="75" height="75" border="0" /><br /></td>
                    <td width="27%" align="center" valign="top" class="text6">

                        <?php
                        if(isset($_REQUEST['sortid'])){
                            $sortid=$_REQUEST['sortid'];
                        }else{
                            $sortid="";
                        }

                        if ($sortid!=""){
                            ?>
                            <a href="up.php?sortid=<?php echo $sortid;?>&id=<?php echo $aid;?>"><img src="images/down.gif" width="10" height="10" /></a>

                            <?php
                        }
                        ?>
                        <?php
                        $sortid=$row['sortID'];



                        if($rec_found >0){
                            ?>
                            <a href="up.php?sortid=<?php echo $sortid;?>&id=<?php echo $aid;?>"><img src="images/up.gif" width="10" height="10" /></a>
                            <?php

                        }
                        ?>

                    </td>
                    <td width="18%" align="center" valign="top" class="text6"><?php echo $row['align'];?></td>
                    <td width="25%" align="left" valign="top"><a href="delimage.php?id=<?php echo $row['id'];?>&amp;imgName=<?php echo $row['imagee'];?>">DELETE</a></td>
                </tr>
                <tr>
                    <td colspan="4" style="border-bottom:solid 1px #000">&nbsp;</td>
                </tr>
                <?php 

            } 

            ?>
        </table>
    </body>
</html>