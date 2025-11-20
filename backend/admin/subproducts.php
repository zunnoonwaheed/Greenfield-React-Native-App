<?php
include("chkLogin.php");
include("includes/db_settings.php");
?>
<?php
$catID=$_REQUEST['catID'];
$mainID=$_REQUEST['mainID'];
$query_c = "select * from products where id=$catID AND catID=$mainID";
$result_c = mysqli_query($con,$query_c); 
$rec_found_c = mysqli_fetch_array($result_c);
//$id=$rec_found_c['id'];
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
                                                    <td height="25" colspan="2" bgcolor="#F0F8FF" class="Heading6"><?php echo $rec_found_c['namee'];?></td>
                                                </tr>
                                                <tr>
                                                    <td height="13" colspan="2" align="left">&nbsp;</td>
                                                </tr>

                                                <tr>
                                                    <td height="13" colspan="2" align="left"><div align="center"><a href="insertsbproducts.php?catID=<?php echo $catID; ?>&mainID=<?php echo $mainID; ?>">INSERT <?php echo $rec_found_c['namee'];?></a></div></td>
                                                </tr>


                                                <tr>
                                                    <td height="13" colspan="2" align="left">&nbsp;</td>
                                                </tr>

                                                <tr>
                                                    <td width="25%" height="13" align="left"><table width="98%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr class="text3">
                                                                <td height="30" align="center" valign="middle" bgcolor="#EEF7FB" class="text3">Title</td>

                                                                <td height="30" align="center" bgcolor="#EEF7FB" class="text3">price</td>
                                                                <td height="30" align="center" bgcolor="#EEF7FB">Options</td>
                                                            </tr>

                                                            <?php 
                                                            $query = "select * from products  where catID=$catID  order by id ASC ";
                                                            //echo $query;
                                                            $s = 1;
                                                            $result = mysqli_query($con,$query); 
                                                            $rec_found = mysqli_num_rows($result);
                                                            if($rec_found >0){
                                                                while($row = mysqli_fetch_array($result)){;



                                                                    ?>


                                                                    <tr>
                                                                        <td colspan="3" align="left" valign="top" class="text6">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td width="37%" align="center" valign="middle" class="text6"><?php echo $row['namee'];?></td>
                                                                        <td width="30%" align="center" valign="middle" class="text6"><?php echo $row['price'];?></td>
                                                                        <td width="33%" align="center" valign="middle"><a href="editsbproducts.php?id=<?php echo $row['id'];?>&catID=<?php echo $row['catID'];?>&mainID=<?php echo $mainID;?>">EDIT</a> - <a href="delsbProducts.php?id=<?php echo $row['id'];?>&catID=<?php echo $row['catID'];?>" onClick="return confirm('ALERT! \nAre you sure you want to delete this category\nand all of its item')">DELETE</a><?php if($mainID!=40){?> - <a href="sbProducts2.php?catID=<?php echo $row['id'];?>">Insert  <?php echo $row['namee'];?></a><?php }?></td>
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
