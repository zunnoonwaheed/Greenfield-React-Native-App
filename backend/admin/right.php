<table width="157" border="0" align="right" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center" valign="top"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="28" height="21" align="left" class="catsam" style="background:url(images2/cat_bg.jpg) repeat-x top;">&nbsp;&nbsp;STORE OFFER</td>
                </tr>
                <?php 
                $r=1;
                $query_right = "select * from products where dhp='yes' LIMIT 0,4";
                //echo $query;
                $result_right = mysqli_query($con,$query_right); 
                while($row_right = mysqli_fetch_array($result_right)){
                    ?>
                    <tr>
                        <td align="center" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td height="8"></td>
                                </tr>

                                <tr>
                                    <td valign="top"><table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="32%" align="left" valign="top"><table width="32" border="0" align="center" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td height="32" align="center" class="white" style="background:url(images2/BG_CIRCLE.jpg) no-repeat center;"><strong><?php echo $r;?></strong></td>
                                                        </tr>
                                                    </table></td>
                                                <td width="68%"><a href="details?id=<?php echo $row_right['id']; ?>&title=<?php echo $row_right['namee']; ?>"><img src="thumb.php?file=admin/upload/products/<?php echo $row_right['imagee'];?>&amp;sizex=68&amp;sizey=127&amp;quality=QUALITY&amp;nocache=NOCACHE" border="0" /></a></td>
                                            </tr>
                                        </table></td>
                                </tr>
                                <tr>
                                    <td align="center"><span class="black2blue"><a href="details?id=<?php echo $row_right['id']; ?>&title=<?php echo $row_right['namee']; ?>" class="black2blues3"><?php echo $row_right['namee']; ?></a></span></td>
                                </tr>
                                <tr>
                                    <td align="center" class="">OUR PRICE: <span class="2"><?php echo "&pound; " . number_format($row_right[''], 0);?></span></td>
                                </tr>

                            </table></td>
                    </tr>

                    <tr>
                        <td height="13" align="left" valign="top"></td>
                    </tr>
                    <?php
                    $r++;
                }
                ?>
            </table></td>
    </tr>
    <tr>
        <td align="left" valign="top"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td height="21" align="left" class="catsam" style="background:url(images2/cat_bg.jpg) repeat-x top;">&nbsp;&nbsp;RECOMENDED PRODUCTS</td>
                </tr>
                <tr>
                    <td width="28" height="10" align="center" valign="top"></td>
                </tr>
                <?php 
                $r=1;
                $query_right = "select * from products where part='yes' LIMIT 0,3";
                //echo $query;
                $result_right = mysqli_query($con,$query_right); 
                while($row_right = mysqli_fetch_array($result_right)){
                    ?>
                    <tr>
                        <td align="center" valign="top"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">

                                <tr>
                                    <td colspan="2" align="center" valign="top"><table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">  
                                            <tr>
                                                <td width="32%" align="left" valign="top"><table width="32" border="0" align="center" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td height="32" align="center" class="white" style="background:url(images2/BG_CIRCLE.jpg) no-repeat center;"><strong><?php echo $r;?></strong></td>
                                                        </tr>
                                                    </table></td>
                                                <td width="68%"><a href="details?id=<?php echo $row_right['id']; ?>&title=<?php echo $row_right['namee']; ?>"><img src="thumb.php?file=admin/upload/products/<?php echo $row_right['imagee'];?>&amp;sizex=68&amp;sizey=127&amp;quality=QUALITY&amp;nocache=NOCACHE" border="0" /></a></td>
                                            </tr>
                                        </table></td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="center" valign="top" ><span class="black2blue"><a href="details?id=<?php echo $row_right['id']; ?>&title=<?php echo $row_right['namee']; ?>" class="black2blues3"><?php echo $row_right['namee']; ?></a></span></td>
                                </tr>
                                <tr>
                                    <td align="center" class="" colspan="2">OUR PRICE: <span class="2"><?php echo "&pound; " . number_format($row_right[''], 0);?></span></td>
                                </tr>
                            </table></td>
                    </tr>
                    <tr>
                        <td height="8" align="left" valign="top"></td>
                    </tr>
                    <?php
                    $r++;
                }
                ?>
            </table></td>
    </tr>
</table>
