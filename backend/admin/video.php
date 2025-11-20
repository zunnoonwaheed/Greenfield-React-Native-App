<?php
include("chkLogin.php");
include("includes/db_settings.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Pro Writer Admin Panel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <!--<title>Altawash Admin Panel </title>-->
        <link href="../stylesheets/public.css" rel="stylesheet" type="text/css" />
        <link href="css/style.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <!-- Main Table Start -->
        <table width="100%" border="1" cellpadding="0" cellspacing="0">
            <tr>
                <td>	<!-- Table Frame Top, Middle, & Botton Start -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr height="100">
                            <td>
                                <!-- Header Content Placement -->
                                <?php require_once("top.php");  ?>						
                            </td>
                        </tr>
                        <tr>

                            <td><table width="100%" border="0">
                                    <!-- Middle Row -->
                                    <tr height="480">
                                        <td  valign="top" width="200">
                                            <!-- Left Navigation Placement -->
                                            <?php include("left.php"); ?>
                                        </td>
                                        <td valign="top">
                                            <!-- Right Page Content Placement -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td height="25" colspan="4" bgcolor="#F0F8FF" class="Heading6">Manage Website</td>
                                                </tr>
                                                <tr>
                                                    <td width="25%" height="13" align="left">&nbsp;</td>
                                                    <td width="25%" align="left">&nbsp;</td>
                                                    <td width="25%" align="left">&nbsp;</td>
                                                    <td width="25%" align="left">&nbsp;</td>
                                                </tr>

                                                <tr>
                                                    <td height="13" colspan="4" align="left"><div align="center"><a href="insertvideo.php">INSERT Website </a></div></td>
                                                </tr>
                                                <tr>
                                                    <td height="13" align="left">&nbsp;</td>
                                                    <td align="left">&nbsp;</td>
                                                    <td align="left">&nbsp;</td>
                                                    <td align="left">&nbsp;</td>
                                                </tr>

                                                <tr>
                                                    <td height="13" colspan="4" align="left"><table width="98%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr class="Heading4">
                                                                <td align="left" valign="top" bgcolor="#EEF7FB" class="Heading4">Website</td>
                                                                <td align="left" valign="top" bgcolor="#EEF7FB" class="Heading4">Logo</td>
                                                                <td height="30" align="left" valign="top" bgcolor="#EEF7FB">Options</td>
                                                            </tr> <tr>
                                                                <td align="left" valign="top" class="text6">&nbsp;</td>
                                                                <td align="left" valign="top" class="text6">&nbsp;</td>
                                                                <td align="left" valign="top">&nbsp;</td>
                                                            </tr>	
                                                            <?php 

                                                            $query = "select * from video order by id DESC ";
                                                            //echo $query;
                                                            $s = 1;
                                                            $result = mysqli_query($con,$query); 
                                                            $rec_found = mysqli_num_rows($result);
                                                            if($rec_found >0){
                                                                while($row = mysqli_fetch_array($result)){;



                                                                    ?>


                                                                    <tr>
                                                                        <td width="42%" align="left" valign="top" class="text6"><span class="Heading5"><?php echo $row['namee'];?></span><br /></td>
                                                                        <td width="40%" align="left" valign="top" class="text6">
                                                                            <img src="upload/logo/<?php echo $row['filee'];?>" /></td>
                                                                        <td width="18%" align="left" valign="top"><a href="editvideo.php?id=<?php echo $row['id'];?>">Edit</a> - <a href="delVideo.php?id=<?php echo $row['id'];?>&imgName=<?php echo $row['filee'];?>" onClick="return confirm('ALERT! \nAre you sure you want to delete this website')">DELETE</a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="3" style="border-bottom:solid 1px #000">&nbsp;</td>
                                                                    </tr>
                                                                    <?php 
                                                                    $s++;
                                                                } 
                                                            }
                                                            ?>
                                                        </table></td>
                                                </tr>
                                            </table></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <?php include("bottom.php");  ?>						
                            </td>
                        </tr>
                    </table>
                    <!-- Table Frame Top, Middle, & Botton End -->
                </td>
            </tr>
        </table>
        <!-- Main Table End -->
    </body>
</html>
