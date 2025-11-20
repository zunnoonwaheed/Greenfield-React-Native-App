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
                                                    <td height="25" colspan="4" bgcolor="#F0F8FF" class="Heading6">Manage Blog, Samples &amp; Answers Comments</td>
                                                </tr>
                                                <tr>
                                                    <td width="34%" height="13" align="left">&nbsp;</td>
                                                    <td width="14%" align="left">&nbsp;</td>
                                                    <td colspan="2" align="left">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td height="13" align="center" class="Heading1">Sort By Status </td>
                                                    <td height="13" align="left"><a href="special.php?statuss=yes&blogID=<?php echo $_GET['blogID'];?>" class="hrBlack">YES </a></td>
                                                    <td width="11%" height="13" align="left"><a href="special.php?statuss=no&blogID=<?php echo $_GET['blogID'];?>" class="hrBlack">NO </a></td>
                                                    <td width="41%" align="left"><a href="special.php?blogID=<?php echo $_GET['blogID'];?>" class="hrBlack">All </a></td>
                                                </tr>
                                                <tr>
                                                    <td height="8" colspan="4" align="left"></td>
                                                </tr>
                                                <tr>
                                                    <td height="20" colspan="4" align="left" bgcolor="#F0F8FF" class="Heading6"> Comments </td>
                                                </tr>
                                                <tr>
                                                    <td height="8" colspan="4" align="left"></td>
                                                </tr>
                                                <tr>
                                                    <td height="13" colspan="4" align="left"><table width="98%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td width="50%" align="left" valign="top" class="text6"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                        <tr>
                                                                            <td width="64%" height="20" bgcolor="#EEF7FB" class="hrBlack">Comments</td>
                                                                            <td width="11%" bgcolor="#EEF7FB" class="hrBlack">Status</td>
                                                                            <td width="25%" bgcolor="#EEF7FB" class="hrBlack">Options</td>
                                                                        </tr>
                                                                        <?php 
                                                                        $blogID=$_GET['blogID'];
                                                                        @$statuss=$_REQUEST['statuss'];
                                                                        if ($statuss !=""){
                                                                            $query = "select * from blog_comments WHERE statuss='$statuss' AND blogID=$blogID order by id DESC ";
                                                                        }else{
                                                                            $query = "select * from blog_comments WHERE blogID=$blogID order by id DESC ";
                                                                        }
                                                                        //echo $query;
                                                                        $s = 1;
                                                                        $result = mysqli_query($con,$query); 
                                                                        $rec_found = mysqli_num_rows($result);
                                                                        if($rec_found >0){
                                                                            while($row = mysqli_fetch_array($result)){;



                                                                                ?>
                                                                                <tr>
                                                                                    <td height="8" colspan="3"></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="text6"><?php echo $row['desc1'];?> by <?php echo $row['namee'] .'('.$row['email'].')';?></td>
                                                                                    <td class="text6"><?php echo $row['statuss'];?></td>
                                                                                    <td align="center" class="text6"><a href="week.php?id=<?php echo $row['id'];?>&amp;statuss=<?php echo $row['statuss'];?>&blogID=<?php echo $blogID?>">change status</a> - <a href="mow.php?id=<?php echo $row['id'];?>&blogID=<?php echo $blogID?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this comment')">Delete</a></td>
                                                                                </tr>
                                                                                <?php 
                                                                                $s++;
                                                                            } 
                                                                        }

                                                                        ?>
                                                                    </table></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="border-bottom:solid 1px #000">&nbsp;</td>
                                                            </tr>
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
