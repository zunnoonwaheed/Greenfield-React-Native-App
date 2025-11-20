<?php
include("chkLogin.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";
?>
<?php
$id = $_REQUEST['id'];

?>

<?php 

$query = "select * from category where id={$id}";
//echo $query;

$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);




?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Pro Writer Admin Panel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <!--<title><?php //echo $m_page_title; ?> CMS </title>-->
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
                                                    <td height="25" colspan="4" bgcolor="#F0F8FF" class="Heading6">Edit Category</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4"><form action="nrUpdated.php" method="post" name="form1" id="form1">

                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td width="18%" align="left" class="text7">Name</td>
                                                                    <td width="82%"><label for="namee2"></label>
                                                                        <input name="namee" type="text" class="text7" id="namee2" size="40" value="<?php echo $row['namee'];?>" /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" class="text7">&nbsp;</td>
                                                                    <td align="left">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2" align="left" class="text7"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td height="25" colspan="2" bgcolor="#EAEAEA" class="Heading1">Title &amp; Meta Tags</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td width="18%" class="text7">Page Title</td>
                                                                                <td width="82%"><label for="title"></label>
                                                                                    <input name="title" type="text" class="text6" id="title" size="60" value="<?php echo $row['title'];?>" /></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="text7">Meta Keyword</td>
                                                                                <td><label for="keyword"></label>
                                                                                    <textarea name="keyword" cols="65" rows="5" class="text6" id="keyword"><?php echo $row['keyword'];?></textarea></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="text7">Meta Description</td>
                                                                                <td><label for="descr"></label>
                                                                                    <textarea name="descr" cols="65" rows="5" class="text6" id="descr"><?php echo $row['descr'];?></textarea></td>
                                                                            </tr>
                                                                        </table></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" class="text7">&nbsp;</td>
                                                                    <td align="left"><input type="hidden" name="id" id="id" value="<?php echo $id; ?>" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                    <td><input name="Submit" type="submit" class="text7" id="Submit" value="Update" />
                                                                        <input name="Reset" type="reset" class="text7" id="Reset" value="Reset" /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                            </table>
                                                        </form></td>
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
