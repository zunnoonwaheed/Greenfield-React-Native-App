<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$id = $_GET['pageID'];
$imgName = $_GET['imgName'];
$imgName1 = $_GET['imgName1'];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Pro Writer Admin Panel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <!--<title>Altawash Admin Panel </title>-->
        <link href="../stylesheets/public.css" rel="stylesheet" type="text/css" />
        <link href="css/style.css" rel="stylesheet" type="text/css" />
     <script type="text/javascript" src="tiny_mce/tiny_mce.js"></script>
        <script type="text/javascript">

            // O2k7 skin
            tinyMCE.init({
                // General options
                mode : "exact",
                elements : "pageData",
                theme : "advanced",
                plugins : "jbimages,autolink,lists,pagereturn,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonreturning,xhtmlxtras,template,wordcount,advlist,autosave",

                // Theme options
                theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonreturning,template,pagereturn,restoredraft",
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : true,

                // Example content CSS (should be your site CSS)
                content_css : "css/content.css",

                // Drop lists for link/image/media/template dialogs
                template_external_list_url : "lists/template_list.js",
                external_link_list_url : "lists/link_list.js",
                external_image_list_url : "lists/image_list.js",
                media_external_list_url : "lists/media_list.js",

                // Style formats
                style_formats : [
                    {title : 'Bold text', inline : 'b'},
                    {title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
                    {title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
                    {title : 'Example 1', inline : 'span', classes : 'example1'},
                    {title : 'Example 2', inline : 'span', classes : 'example2'},
                    {title : 'Table styles'},
                    {title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
                ],

                // Replace values for the template plugin
                template_replace_values : {
                    username : "Some User",
                    staffid : "991234"
                }
            });

        </script>

    </head>

    <body>
        <!-- Main Table Start -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>	<!-- Table Frame Top, Middle, & Botton Start -->
                    <table width="100%" border="1" cellpadding="0" cellspacing="0">
                        <tr height="100">
                            <td>
                                <!-- Header Content Placement -->
                                <?php require_once("top.php");  ?>
                            </td>
                        </tr>
                        <tr>

                            <td><table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <!-- Middle Row -->
                                <tr height="480">
                                    <td  valign="top" width="200">
                                        <!-- Left Navigation Placement -->
                                    <?php include("left.php"); ?>							</td>
                                    <td valign="top">
                                        <!-- Right Page Content Placement -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top">
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                        <tr height="20">
                                                            <td height="30" bgcolor="#F0F8FF" class="Heading6">
                                                                <!-- Page Title Content Placement -->
                                                            <span class="heading">Edit Text Pages</span> </td>
                                                        </tr>
                                                        <tr>
                                                            <td><table width="100%" border="1" cellpadding="5">
                                                                <tr>
                                                                    <td><form action="edited_tp.php" method="post" enctype="multipart/form-data" name="form2" id="form2">


                                                                            <?php 
                                                                            $query = "select * from textpage where id={$id}";
                                                                            //echo $query;
                                                                            $result = mysqli_query($con,$query); 
                                                                            $row = mysqli_fetch_array($result);

                                                                            //echo " <h2>". $row['page_title'] . "</h2>";

                                                                            ?>

                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                <tr>
                                                                                    <td width="25%"><input name="id" type="hidden" value="<?php echo $row['id']; ?>" /><input type="hidden" name="imgName" id="imgName" value="<?php echo $imgName; ?>" /><input type="hidden" name="imgName1" id="imgName1" value="<?php echo $imgName1; ?>" />
                                                                                    </td>
                                                                                    <td width="82%">&nbsp;</td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td width="25%" class="hrBlack">Page Title:</td>
                                                                                    <td width="82%" align="left">
                                                                                        <input name="namee" type="text" id="namee" value="<?php echo $row['namee'];?>" size="35" /></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td width="25%" class="hrBlack">Menu Title:</td>
                                                                                    <td width="82%" align="left">
                                                                                        <input name="menu_namee" type="text" id="menu_namee" value="<?php echo $row['menu_namee'];?>" size="35" /></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Page Slug</td>
                                                                                    <td><select name="slug1">
                                                                                        <?php if ($_SESSION['websiteID']==1){?><option value="hr"<?php if ($row['slug1']=="hr"){?> selected="selected" <?php }?>>hr</option><?php }elseif($_SESSION['websiteID']==2){?><option value="hr"<?php if ($row['slug1']=="hr"){?> selected="selected" <?php }?>>hr</option><?php } ?>
                                                                                        <option value="editing"<?php if ($row['slug1']=="editing"){?> selected="selected" <?php }?>>editing</option></select> / <input type="text" name="slug" id="slug_input" class="slug" size="40" value="<?php echo $row['slug'];?>" /></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Icon</td>
                                                                                    <td><input name="icon" type="text" id="icon" size="35" value="<?php echo $row['icon'];?>" /></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Tagline</td>
                                                                                    <td><textarea name="tagline" cols="65" rows="2" class="text6" id="tagline"><?php echo $row['tagline'];?></textarea></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack"> Image</td>
                                                                                    <td class="text4"><input name="file1" type="file" class="text6" id="file1" size="40" /></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Menu Icon Image</td>
                                                                                    <td class="text4"><label for="file2"></label>
                                                                                        <input name="file2" type="file" class="text6" id="file2" size="40" />
                                                                                        (Image Size width=&quot;24px&quot; height=&quot;24px&quot;)</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Display in</td>
                                                                                    <td>
                                                                                        <select name="desc1">
                                                                                            <option value="top" <?php if ($row['desc1']=="top"){?> selected="selected" <?php } ?>>Top Menu</option>
                                                                                            <option value="left" <?php if ($row['desc1']=="left"){?> selected="selected" <?php } ?>>Left Menu</option>
                                                                                            <option value="footer" <?php if ($row['desc1']=="footer"){?> selected="selected" <?php } ?>>Bottom Menu</option>
                                                                                            <option value="none" <?php if ($row['desc1']=="none"){?> selected="selected" <?php } ?>>None</option>
                                                                                        </select></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Primary Page</td>
                                                                                    <td><select name="pageID" id="pageID">


                                                                                            <option value="0" <?php if($row['pageID']==0){?> selected="selected"<?php } ?>>Select Primary Page</option>
                                                                                            <?php
                                                                                            $query_top = "select * from textpage where desc1='top' AND websiteID=".$_SESSION['websiteID']." order by id";
                                                                                            $result_top = mysqli_query($con,$query_top); 
                                                                                            while($row_top = mysqli_fetch_array($result_top))
                                                                                            {

                                                                                                ?>
                                                                                                <option value="<?php echo $row_top['id'];?>" <?php if($row_top['id']==$row['pageID']){?> selected="selected"<?php } ?>><?php echo $row_top['namee'];?></option>
                                                                                                <?php } ?>

                                                                                        </select></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td class="hrBlack">Short Description</td>
                                                                                    <td><textarea name="short_desc" cols="70" rows="10"><?php echo $row['short_desc']; ?></textarea></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>&nbsp;</td>
                                                                                    <td>&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="hrBlack">Page Description</td>
                                                                                    <td><textarea name="pageData" cols="90" rows="20"><?php echo $row['pageData']; ?></textarea></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="2">&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="2"><table width="90%" border="0" cellspacing="0" cellpadding="0">
                                                                                            <tr>
                                                                                                <td height="25" colspan="2" bgcolor="#EAEAEA" class="Heading1">Title &amp; Meta Tags</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>&nbsp;</td>
                                                                                                <td>&nbsp;</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td width="20%" class="text7">Page Title</td>
                                                                                                <td width="80%"><label for="title"></label>
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
                                                                                            </tr><tr>
                                                                                                <td>&nbsp;</td>
                                                                                                <td>&nbsp;</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td class="text7">Additional Headers</td>
                                                                                                <td><label for="descr"></label>
                                                                                                    <textarea name="addhead" cols="65" rows="5" class="text6" id="addhead"><?php echo $row['addhead'];?></textarea></td>
                                                                                            </tr>
                                                                                        </table></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="2">&nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="2" align="center"><input name="Submit2" type="submit" class="text7" value="Update" /></td>
                                                                                </tr>
                                                                            </table>

                                                                        </form></td>
                                                                </tr>

                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                            </table>					        </td>
                                                        </tr>
                                                </table>	</td>
                                            </tr>
                                    </table>							</td>
                                </tr>
                            </table>					</td>
                        </tr>
                        <tr>
                            <td>
                            <?php include("bottom.php");  ?>						</td>
                        </tr>
                    </table>
                    <!-- Table Frame Top, Middle, & Botton End -->
                </td>
            </tr>
        </table>
        <!-- Main Table End -->
    </body>
</html>
